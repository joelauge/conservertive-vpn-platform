import { IsString, IsEmail, IsOptional, IsIn, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSponsorshipRequestDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  reason: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  urgency?: 'low' | 'medium' | 'high' = 'medium';

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
