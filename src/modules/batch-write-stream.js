import { Writable } from 'stream';

import { createBatch } from '../lib';

const emitStreamError = (inputFunction) => async (param, meta, context) => {
  try {
    const result = await inputFunction(param, meta, context);
    return result;
  } catch (e) {
    context.stream.emit('error', e);
    return e;
  }
};

const batchWriteStream = ({ writeFunction, param = {} }, meta, context) => {
  const writeFunctionEmitStreamError = emitStreamError(writeFunction);

  const BATCH_SIZE = process.env.STREAM_BATCH_SIZE || 100;
  const batch = createBatch({ size: BATCH_SIZE });

  const stream = new Writable({
    objectMode: true,
    write: async (record, encoding, next) => {
      batch.add(record);

      if (batch.full) {
        await writeFunctionEmitStreamError(
          { ...param, data: batch.data },
          { ...meta, batchId: batch.number },
          {
            ...context,
            stream,
            batch,
          },
        );

        batch.next();
      }

      next();
    },
  });

  stream.on('finish', async () => {
    if (batch.data.length > 0) {
      await writeFunctionEmitStreamError(
        { ...param, data: batch.data },
        { ...meta, batchId: batch.number },
        {
          ...context,
          stream,
          batch,
        },
      );
    }

    stream.destroy();
    stream.emit('close'); // workaround in case destroy doesn't emit close
  });

  return stream;
};

export default batchWriteStream;
