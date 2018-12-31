import micro from 'micro';
import requestHandler from './';

micro(requestHandler).listen(process.env.PORT || 3000);
