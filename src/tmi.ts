import { Accessor, createEffect, createSignal, on } from "solid-js";
import tmi from "tmi.js";
import { getAllEmotes } from "./emotes";

const MESSAGE_LIMIT = 100;

export type EmoteRange = {
  start: number;
  end: number;
};

export type Message = {
  user: string;
  userColor: string;
  message: string;
  emotes: [string, EmoteRange][];
};

const getDefaultEmoteLink = (emoteId: string) =>
  `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0`;

function getEmotes(
  message: string,
  emoteMap: Map<string, string>,
  rawEmotes?: Record<string, string[]>
) {
  const emotes: [string, EmoteRange][] = [];

  // default emotes offered by TMI
  if (rawEmotes) {
    for (const [emoteId, ranges] of Object.entries(rawEmotes)) {
      ranges.forEach((range) => {
        const [start, end] = range.split("-");
        emotes.push([
          getDefaultEmoteLink(emoteId),
          { start: Number(start), end: Number(end) },
        ]);
      });
    }
  }

  // parse emotes from 7TV, BTV, and FFZ
  let start = 0;
  for (let i = 0; i < message.length; i++) {
    if (message[i] === " " || i === message.length - 1) {
      const end = i === message.length - 1 ? i : i - 1;
      const emoteLink = emoteMap.get(message.slice(start, end + 1));
      if (emoteLink) emotes.push([emoteLink, { start, end }]);
      start = i + 1;
    }
  }

  // sort emotes by start index and remove duplicates
  const indexSet = new Set<number>();
  return emotes
    .filter(([_, { start }]) => {
      if (indexSet.has(start)) return false;
      indexSet.add(start);
      return true;
    })
    .sort(([, { start: s1 }], [, { start: s2 }]) => (s1 > s2 ? 1 : -1));
}

const [syncedMessages, setSyncedMessages] = createSignal<Message[]>([]);
const [displayMessages, setDisplayMessages] = createSignal<Message[]>([]);

export async function startChat(channel: string) {
  setSyncedMessages([]);
  setDisplayMessages([]);
  const client = new tmi.Client({
    channels: [channel],
  });
  const emoteMap = await getAllEmotes(channel);

  client.connect();

  client.on("message", (channel, tags, message, self) => {
    const new_messages =
      syncedMessages().length >= MESSAGE_LIMIT
        ? syncedMessages().slice(1)
        : syncedMessages().slice();
    new_messages.push({
      user: tags["display-name"]!,
      userColor: tags["color"] ?? "#000000",
      message,
      emotes: getEmotes(message, emoteMap, tags.emotes),
    });
    setSyncedMessages(new_messages);
  });

  return client;
}

export function useMessages(getSync: Accessor<boolean>) {
  // immediately sync display messages (don't wait for next message)
  createEffect(
    on(getSync, (gs) => gs && setDisplayMessages(syncedMessages()), {
      defer: true,
    })
  );

  // update displayed messages on message received if sync enabled
  createEffect(on(syncedMessages, (sm) => getSync() && setDisplayMessages(sm)));

  return displayMessages;
}
