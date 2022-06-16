import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import mimetype from 'mime-types';

const processAttachment = (AdditionalDocumentReference) => {
  const filename = AdditionalDocumentReference.Attachment.EmbeddedDocumentBinaryObject['@_filename'];
  const filenameWithoutExtension = path.parse(filename).name;
  const mimecode = AdditionalDocumentReference.Attachment.EmbeddedDocumentBinaryObject['@_mimeCode'];
  const attachmentContent = AdditionalDocumentReference.Attachment.EmbeddedDocumentBinaryObject['#text'];

  const fileExtension = mimetype.extension(mimecode);
  const saveAsFilename = `${filenameWithoutExtension}.${fileExtension}`;

  console.log(chalk.green.bold(` Saving ${fileExtension.toUpperCase()} attachment as ${saveAsFilename} `));

  fs.writeFileSync(`${saveAsFilename}`, attachmentContent, 'base64');
};

const attachments = (filePath) => {
  fs.readFile(filePath, 'utf8', (error, data) => {
    if (error) {
      // console.error(error);
      console.error(chalk.red.bold(` Could not read ${filePath} `));
      console.error(chalk.red(error));

      return null;
    }

    console.log(chalk.bgGreenBright.black.bold(` Reading file ${filePath} \n`));

    const XMLParserOptions = {
      ignoreAttributes: false,
      removeNSPrefix: true,
    };
    const parser = new XMLParser(XMLParserOptions);
    const ehfJSON = parser.parse(data);

    const AdditionalDocumentReference = (ehfJSON.CreditNote)
      ? ehfJSON.CreditNote.AdditionalDocumentReference
      : ehfJSON.Invoice.AdditionalDocumentReference;

    // check if additional document reference is array
    if (Array.isArray(AdditionalDocumentReference)) {
      AdditionalDocumentReference.forEach((additionalDocumentReference) => {
        processAttachment(additionalDocumentReference);
      });
    } else {
      processAttachment(AdditionalDocumentReference);
    }

    return ehfJSON;
  });
};

// export attachments;
export default attachments;
