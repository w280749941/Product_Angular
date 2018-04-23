import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class WebSocketService {

  ws: WebSocket;

  constructor() { }

  createObservableSocket(url: string, id: number): Observable<any> {
    this.ws = new WebSocket(url);
    return new Observable<string>(
      observer => {
        // Send data when there is an incoming message
        this.ws.onmessage = event => observer.next(event.data);
        // Send error when there is an error
        this.ws.onerror = event => observer.error(event);
        // Send complete signal when socket is closed.
        this.ws.onclose = event => observer.complete();
        // Send productId to server.
        this.ws.onopen = event => this.sendMessage({productId: id});
        // On unsubscription close web socket.
        return () => this.ws.close();
      }
    ).map(message => JSON.parse(message));
  }

  sendMessage(message: any) {
    this.ws.send(JSON.stringify(message));
  }

}
