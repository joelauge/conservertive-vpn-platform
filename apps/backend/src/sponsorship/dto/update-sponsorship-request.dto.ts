import { PartialType } from '@nestjs/mapped-types';
import { CreateSponsorshipRequestDto } from './create-sponsorship-request.dto';
import { IsOptional, IsIn, IsDateString } from 'class-validator';

export class UpdateSponsorshipRequestDto extends PartialType(CreateSponsorshipRequestDto) {
  @IsOptional()
  @IsIn(['pending', 'matched', 'expired', 'cancelled'])
  status?: 'pending' | 'matched' | 'expired' | 'cancelled';

  @IsOptional()
  @IsDateString()
  matchedAt?: Date;
}
