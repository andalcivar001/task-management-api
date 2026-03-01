import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from './enums/task-status.enum';
import { User } from '../user/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(taskDto: CreateTaskDto, idUser: number) {
    const user = await this.userRepository.findOneBy({ id: idUser });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    console.log('taskDto', taskDto);
    const newTask = this.taskRepository.create({
      ...taskDto,
      owner: user,
    });

    return this.taskRepository.save(newTask);
  }

  async findAll(status?: TaskStatus) {
    if (status) {
      return this.taskRepository.find({
        where: { status },
        relations: ['owner'],
      });
    }

    return this.taskRepository.find();
  }

  async findById(id: number) {
    try {
      const task = await this.taskRepository.findOneBy({ id });
      if (!task) {
        throw new HttpException('Tarea no encontrada', HttpStatus.NOT_FOUND);
      }

      return task;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, task: CreateTaskDto) {
    try {
      const taskFound = await this.taskRepository.findOneBy({ id });

      if (!taskFound) {
        throw new HttpException('Tarea no existe', HttpStatus.NOT_FOUND);
      }

      const updateTask = Object.assign(taskFound, task);
      return await this.taskRepository.save(updateTask);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number) {
    try {
      const task = await this.taskRepository.findOneBy({ id });

      if (!task) {
        throw new HttpException('Tarea no encontrada', HttpStatus.NOT_FOUND);
      }

      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
