import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    //console.log({token});
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      console.log(error);

      client.disconnect();
      return;
    }

    //console.log({payload});
    //console.log('Cliente conectado', client.id);
    //console.log({conectados: this.messagesWsService.getConnectedClients()});
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    //console.log('Cliente desconectado', client.id);
    this.messagesWsService.removeClient(client.id);
    //console.log({conectados: this.messagesWsService.getConnectedClients()});
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  async handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    //console.log(client.id, payload);

    /*!! Emite unicamente al cliente, no a todos.
    client.emit('message-from-client', {
      fullName: 'Soy yo',
      message: payload.message || 'no-message!!'
    });
    */

    /*!! Emite a todos menos al cliente inicial
    client.broadcast.emit('message-from-client', {
      fullName: 'Soy yo',
      message: payload.message || 'no-message!!'
    });
    */

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!',
    });
  }
}
