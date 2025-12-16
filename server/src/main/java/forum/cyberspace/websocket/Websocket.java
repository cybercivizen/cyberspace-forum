package forum.cyberspace.websocket;

import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.quarkus.websockets.next.OnClose;
import io.quarkus.websockets.next.OnOpen;
import io.quarkus.websockets.next.OnTextMessage;
import io.quarkus.websockets.next.UserData;
import io.quarkus.websockets.next.WebSocket;
import io.quarkus.websockets.next.WebSocketConnection;
import jakarta.inject.Inject;

@WebSocket(path = "/chat")
public class Websocket {

    private static final UserData.TypedKey<String> USERNAME_KEY = UserData.TypedKey.forString("username");

    @Inject
    ObjectMapper objectMapper;
    @Inject
    WebSocketConnection connection;

    public enum MessageType {
        JOIN, CHAT, LEAVE
    }

    // Match your frontend message structure
    public record User(int id, String username, String profilePictureUrl) {
    }

    public record ChatMessage(int id, String content, String createdAt, User user) {
    }

    public record WebsocketMessage(MessageType type, User user, Optional<ChatMessage> message) {
    }

    @OnOpen
    public void onOpen() {
        System.out.println("🟢 New connection: " + connection.id());
    }

    @OnTextMessage
    public void onMessage(String message) {
        System.out.println("📩 Received JSON: " + message);

        try {
            WebsocketMessage wsMessage = objectMapper.readValue(message, WebsocketMessage.class);

            switch (wsMessage.type()) {
                case JOIN:
                    System.out.println("👤 User joined: " + wsMessage.user().username());
                    connection.broadcast().sendTextAndAwait(message);
                    connection.userData().put(USERNAME_KEY, wsMessage.user().username());
                    break;
                case CHAT:
                    if (wsMessage.message().isPresent()) {
                        System.out.println(wsMessage.user().username() + ": " + wsMessage.message().get().content());
                        connection.broadcast().sendTextAndAwait(message);
                    }
                    break;
                case LEAVE:
                    System.out.println("👋 User left: " + wsMessage.user().username());
                    connection.broadcast().sendTextAndAwait(message);
                    break;
            }

        } catch (Exception e) {
            System.err.println("❌ Error parsing message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @OnClose
    public void onClose() {
        System.out.println("🔴 Connection closed: " + connection.id());
        String username = connection.userData().get(USERNAME_KEY);
        if (username != null) {

            WebsocketMessage leaveMessage = new WebsocketMessage(MessageType.LEAVE,
                    new User(0, username, ""), Optional.empty());

            try {
                connection.broadcast().sendTextAndAwait(leaveMessage);
            } catch (Exception e) {
                System.err.println("❌ Error sending LEAVE message: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}
