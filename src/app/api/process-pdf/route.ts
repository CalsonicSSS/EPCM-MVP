import { openai } from '@/utils/declarations';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  console.log('Processing PDF file begins...');

  try {
    // Step 1: Create a new Assistant with File Search Enabled
    const assistant = await openai.beta.assistants.create({
      name: 'Spanish RFQ Analyzer',
      instructions: `
          You are an expert in analyzing Spanish RFQ (Request for Quote) or tender files.
          Your task is to extract and translate specific information from these documents to English.
          
          For the uploaded pdf document, extract and translate following fields and data:

          - under "Información" section:
            1. Description (Descripción)
            2. Tender number (Número de licitación)

          - under "Modalidades de licitación" section:
            3. Tender currency (Moneda de licitación)
            4. Additional allowed currencies (Monedas adicionales permitidas)
            5. Time zone (Huso horario)
            6. Offer submission period (Período de presentación de oferta)
            7. Opening date (Fecha de apertura)

          - under "Detalles de la licitación" section:
            this is the section that contains all the item under this pdf document. This section organize each item under table format with 6 fields organized into 3 columns
            extract and translate following fields and data:

            1. Position type (Tipo de posición)
            2. Supplier product number (Número de producto de proveedor)
            3. Delivery date (Fecha de entrega/Período de prestación)
            4. Product number (Número de producto)
            5. Item Description (Denominación)
            6. Quantity (Cantidad)
  
          Present the final extracted information in a structured JSON format.

          sameple JSON format:
          {
          "pdfInfo": {
            "tenderDescription": "SANDVIK SPARE PARTS",
            "tenderNumber": "7000375373",
            "tenderCurrency": "USD",
            "additionalCurrenciesAllowed": ["EUR", "CLP"],
            "timezone": "CHILE",
            "offerSubmissionPeriod": "00:00:00 - 05.08.2024 15:00:00",
            "openingDate": "05.08.2024 15:00:05",
           },
           "items": [
                {
                    "positionType": "Material",
                    "supplierProductNumber": "BG01048548",
                    "deliveryDate": "22.08.2024 00:00:00",
                    "productNumber": "1527642",
                    "itemDescription": "SANDVIK ACCUMULATOR BG01048548",
                    "quantity": "1 UN"
                },
            ]
          }

          response instruction: 
          - you need to fully and thoroughly extract all the required information from the uploaded pdf document.
          - you need to translate all the field names and also the data to English FULLY.
          - you can not miss any item under the "Detalles de la licitación" section by going through all the pages.
          - your final response will only contain final JSON (follow above format) with extracted data with no other additional texts or comments. 
        `,
      model: 'gpt-4o',
      tools: [{ type: 'file_search' }],
    });

    console.log('step 1 completed');

    // Step 2: Upload files and add them to a Vector Store
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const uploadedFile = await openai.files.create({
      file: file, // Pass the File object directly here
      purpose: 'assistants',
    });

    // Create a vector store
    const vectorStore = await openai.beta.vectorStores.create({
      name: 'Spanish RFQ Documents',
    });

    // Add the file to the vector store and wait for processing to complete
    await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {
      files: [file], // Pass the File object directly here
    });

    console.log('step 2 completed');

    // Step 3: Update the assistant to use the new Vector Store
    await openai.beta.assistants.update(assistant.id, {
      tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
    });

    console.log('step 3 completed');

    // Step 4: Create a thread
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: 'Please analyze the uploaded Spanish RFQ PDF and extract the required information and directly present in JSON format without any additional text or comments.',
        },
      ],
    });

    console.log('step 4 completed');

    // Step 5: Create a run and check the output
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    console.log('step 5 completed');

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Retrieve the messages
    const messages = await openai.beta.threads.messages.list(thread.id);

    // Find the last assistant message
    const lastAssistantMessage = messages.data.filter((message) => message.role === 'assistant').pop();

    console.log('lastAssistantMessage:', lastAssistantMessage);

    let extractedData = {};
    if (lastAssistantMessage && lastAssistantMessage.content[0].type === 'text') {
      try {
        let responseText = lastAssistantMessage.content[0].text.value;

        // Remove code block markers if present
        responseText = responseText
          .replace(/```json\n?/, '')
          .replace(/```$/, '')
          .trim();

        console.log('Parsed response text:', responseText);
        extractedData = JSON.parse(responseText);
      } catch (error) {
        console.error('Error parsing JSON from assistant response:', error);
        console.log('Raw response:', lastAssistantMessage.content[0].text.value);
      }
    }

    // Clean up: delete the assistant, vector store, and the file
    await openai.beta.assistants.del(assistant.id);
    await openai.beta.vectorStores.del(vectorStore.id);
    await openai.files.del(uploadedFile.id);

    console.log('Extracted data:', extractedData);

    return NextResponse.json(extractedData);
  } catch (error: any) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: 'An error occurred during PDF processing.' }, { status: 500 });
  }
}
