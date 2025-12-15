package forum.cyberspace.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.quarkus.websockets.next.OnClose;
import io.quarkus.websockets.next.OnOpen;
import io.quarkus.websockets.next.OnTextMessage;
import io.quarkus.websockets.next.WebSocket;
import io.quarkus.websockets.next.WebSocketConnection;
import jakarta.inject.Inject;

@WebSocket(path = "/chat")
public class Websocket {

    @Inject
    ObjectMapper objectMapper;
    @Inject
    WebSocketConnection connection;

    // Match your frontend message structure
    public record User(int id, String username, String profilePictureUrl) {

    }

    public record ChatMessage(int id, String content, String createdAt, User user) {
    }

    @OnOpen
    public void onOpen() {
        System.out.println("🟢 New connection: " + connection.id());
    }

    @OnTextMessage
    public void onMessage(String message) {
        System.out.println("📩 Received JSON: " + message);

        try {
            ChatMessage msg = objectMapper.readValue(message, ChatMessage.class);
            System.out.println(msg.user.username + ": " + msg.content);
            connection.broadcast().sendTextAndAwait(message);

        } catch (Exception e) {
            System.err.println("❌ Error parsing message: " + e.getMessage());
            e.printStackTrace();
        }

    }

    @OnClose
    public void onClose() {
        System.out.println("🔴 Connection closed: " + connection.id());
    }
}
