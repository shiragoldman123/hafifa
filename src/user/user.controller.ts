import { Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '../user/user.schema';
import { JoiValidationGuard } from '../guards/joi-validator.pipe';
import Joi from 'joi';

@Controller('')
@ApiTags('')
@ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Bad Request',
})
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all data from the local database' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [User],
  })
  findAll() {
    return this.usersService.findAllDB();
  }

  @Post()
  @ApiOperation({ summary: 'Update all the data from the local database' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [User],
  })
  updateAll() {
    return this.usersService.updateAll();
  }

  @UseGuards(new JoiValidationGuard(Joi.object({ params: { personalNumber: Joi.string().required() } })))
  @Get('/personalNumber/:personalNumber')
  @ApiOperation({ summary: 'Get by personal number from the local database' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  findByPersonalNumber(
    @Param('personalNumber')
    personalNumber: string,
  ) {
    return this.usersService.findByPersonalNumber(personalNumber);
  }

  @UseGuards(new JoiValidationGuard(Joi.object({ params: { identityCard: Joi.string().required() } })))
  @Get('identityCard/:identityCard')
  @ApiOperation({ summary: 'Get by identity card from the local database' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  findByIdentityCard(
    @Param('identityCard')
    identityCard: string,
  ) {
    return this.usersService.findByIdentityCard(identityCard);
  }

  @UseGuards(new JoiValidationGuard(Joi.object({ params: { user: Joi.string().required() } })))
  @Get('/user/:user')
  @ApiOperation({ summary: 'Get by user from the local database' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  findByUser(@Param('user') user: string) {
    return this.usersService.findByUser(user);
  }
}
