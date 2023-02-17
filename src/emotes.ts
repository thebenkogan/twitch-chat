// ugly code to get a key in a nested object without knowing the structure
const getKeyValue = (targetKey: string, obj: any): any => {
  for (const [key, value] of Object.entries(obj)) {
    if (key === targetKey) {
      return value;
    } else if (value !== null && typeof value === "object") {
      const nested = getKeyValue(targetKey, value);
      if (nested) return nested;
    }
  }
};

type Emote = {
  name: string;
  url: string;
};

type SevenTV = {
  name: string;
  urls: string[][];
};

async function get7TVEmotes(channel: string) {
  const channelUrl = `https://api.7tv.app/v2/users/${channel}/emotes`;
  const globalUrl = "https://api.7tv.app/v2/emotes/global";
  const chEmotes: Promise<SevenTV[]> = fetch(channelUrl).then((res) =>
    res.ok ? res.json() : []
  );
  const gbEmotes: Promise<SevenTV[]> = fetch(globalUrl).then((res) =>
    res.json()
  );
  return Promise.all([chEmotes, gbEmotes]).then((res) =>
    res.flat().map<Emote>((e) => ({ name: e.name, url: e.urls[0][1] }))
  );
}

type FFZ = {
  name: string;
  urls: {
    1: string;
  };
};

async function getFFZEmotes(channel: string) {
  const channelUrl = `https://api.frankerfacez.com/v1/room/${channel}`;
  const globalUrl = "https://api.frankerfacez.com/v1/set/global";
  const chEmotes: Promise<FFZ[]> = fetch(channelUrl)
    .then((res) => (res.ok ? res.json() : { emoticons: [] }))
    .then((res) => getKeyValue("emoticons", res));
  const gbEmotes: Promise<FFZ[]> = fetch(globalUrl)
    .then((res) => res.json())
    .then((res) => getKeyValue("emoticons", res));
  return Promise.all([chEmotes, gbEmotes]).then((res) =>
    res.flat().map<Emote>((e) => ({ name: e.name, url: e.urls[1] }))
  );
}

type BTV = {
  code: string;
  id: string;
};

const getBTVLink = (id: string) => `https://cdn.betterttv.net/emote/${id}/1x`;

async function getBTVEmotes() {
  const globalUrl = "https://api.betterttv.net/3/cached/emotes/global";
  return fetch(globalUrl)
    .then((res) => res.json())
    .then((res: BTV[]): Emote[] =>
      res.map((e) => ({ name: e.code, url: getBTVLink(e.id) }))
    );
}

export async function getAllEmotes(channel: string) {
  const emoteMap = new Map<string, string>();
  const emotes = await Promise.all([
    get7TVEmotes(channel),
    getFFZEmotes(channel),
    getBTVEmotes(),
  ]).then((res) => res.flat());
  emotes.forEach((e) => emoteMap.set(e.name, e.url));
  return emoteMap;
}
