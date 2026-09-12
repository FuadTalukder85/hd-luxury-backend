import { Module } from '@nestjs/common';
import { ContactsModule } from '../contacts/contacts.module';
import { PropertiesModule } from '../properties/properties.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { UsersModule } from '../users/users.module';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [PropertiesModule, UsersModule, ContactsModule, ReviewsModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
