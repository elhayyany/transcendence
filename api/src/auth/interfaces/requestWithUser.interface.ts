import { Request } from 'express';
import { UserTfaDto } from '../../dto/all.dto';

interface RequestWithUser extends Request {
  user: UserTfaDto;
}

export default RequestWithUser;
