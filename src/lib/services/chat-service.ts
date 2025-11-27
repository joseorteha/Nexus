// 💬 CHAT SERVICE - Servicio de mensajería (preparado para Supabase)
// Este servicio maneja toda la lógica de chat
// TODO: Cuando esté Supabase, reemplazar los mocks por queries reales

import type { Message, ChatConversation } from "@/types/nexus";

// Simulación de base de datos en memoria (temporal)
let messagesDB: Message[] = [
  {
    id: "1",
    conversationId: "conv-1-2",
    senderId: "1",
    receiverId: "2",
    content: "¡Hola! Vi que ofrecen servicios de logística. Necesitamos distribuir nuestro café.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
  },
  {
    id: "2",
    conversationId: "conv-1-2",
    senderId: "2",
    receiverId: "1",
    content: "¡Hola! Sí, tenemos experiencia en transporte de productos agrícolas. ¿A dónde necesitan enviar?",
    timestamp: new Date(Date.now() - 3300000).toISOString(),
    read: true,
  },
  {
    id: "3",
    conversationId: "conv-1-2",
    senderId: "1",
    receiverId: "2",
    content: "Principalmente a Orizaba y Córdoba. ¿Cuáles son sus tarifas?",
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    read: false,
  },
  {
    id: "4",
    conversationId: "conv-1-3",
    senderId: "3",
    receiverId: "1",
    content: "Hola, nos interesa tu café orgánico. ¿Tienen certificaciones?",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
  },
];

/**
 * Obtener todas las conversaciones de un usuario
 * TODO: Reemplazar con: supabase.from('conversations').select('*, company(*)')
 */
export async function getConversations(userId: string): Promise<ChatConversation[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // Agrupar mensajes por conversación
  const conversationsMap = new Map<string, Message[]>();
  
  messagesDB.forEach(msg => {
    if (msg.senderId === userId || msg.receiverId === userId) {
      if (!conversationsMap.has(msg.conversationId)) {
        conversationsMap.set(msg.conversationId, []);
      }
      conversationsMap.get(msg.conversationId)!.push(msg);
    }
  });

  // Convertir a ChatConversation[]
  const conversations: ChatConversation[] = Array.from(conversationsMap.entries()).map(([convId, messages]) => {
    const lastMessage = messages[messages.length - 1];
    const otherUserId = lastMessage.senderId === userId ? lastMessage.receiverId : lastMessage.senderId;
    const unreadCount = messages.filter(m => m.receiverId === userId && !m.read).length;

    return {
      id: convId,
      companyId: otherUserId,
      lastMessage: lastMessage.content,
      lastMessageTime: lastMessage.timestamp,
      unreadCount,
    };
  });

  return conversations.sort((a, b) => 
    new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  );
}

/**
 * Obtener mensajes de una conversación específica
 * TODO: Reemplazar con: supabase.from('messages').select('*').eq('conversation_id', conversationId)
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  await new Promise(resolve => setTimeout(resolve, 200));

  return messagesDB
    .filter(msg => msg.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

/**
 * Enviar un mensaje
 * TODO: Reemplazar con: supabase.from('messages').insert({ ... })
 */
export async function sendMessageToChat(
  conversationId: string,
  senderId: string,
  receiverId: string,
  content: string
): Promise<Message> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    conversationId,
    senderId,
    receiverId,
    content,
    timestamp: new Date().toISOString(),
    read: false,
  };

  messagesDB.push(newMessage);

  return newMessage;
}

/**
 * Marcar mensajes como leídos
 * TODO: Reemplazar con: supabase.from('messages').update({ read: true })
 */
export async function markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));

  messagesDB = messagesDB.map(msg => {
    if (msg.conversationId === conversationId && msg.receiverId === userId && !msg.read) {
      return { ...msg, read: true };
    }
    return msg;
  });
}

/**
 * Suscribirse a mensajes nuevos en tiempo real
 * TODO: Reemplazar con: supabase.channel('messages').on('INSERT', callback)
 */
export function subscribeToMessages(
  conversationId: string,
  callback: (message: Message) => void
): () => void {
  // Simular real-time con polling (temporal)
  let lastMessageCount = messagesDB.filter(m => m.conversationId === conversationId).length;

  const interval = setInterval(() => {
    const currentMessages = messagesDB.filter(m => m.conversationId === conversationId);
    if (currentMessages.length > lastMessageCount) {
      const newMessage = currentMessages[currentMessages.length - 1];
      callback(newMessage);
      lastMessageCount = currentMessages.length;
    }
  }, 2000);

  // Retornar función para cancelar suscripción
  return () => clearInterval(interval);
}
