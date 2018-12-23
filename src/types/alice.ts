export type AliceRequest = {
  meta: Meta;
  request: Request;
  session: RequestSession;
  version: string;
}

export type AliceResponse = {
  response: Response;
  session: ResponseSesstion;
  version: string;
}

export type RequestSession = {
  new: boolean;
  message_id: number;
  session_id: string;
  skill_id: string;
  user_id: string;
}

export type ResponseSesstion = {
  session_id: string;
  skill_id: string;
  user_id: string;
}

export type Request = {
  command: string;
  original_utterance: string;
  nlu?: Nlu;
  markup?: Markup;
  payload?: Screen;
  type: 'SimpleUtterance' | 'ButtonPressed';
}

export type Nlu = {
  tokens: string[];
  entities: Entity[];
}

export type Entity = {
  tokens: Tokens;
  type: 'YANDEX.GEO' | 'YANDEX.FIO' | 'YANDEX.NUMBER' | 'YANDEX.DATETIME';
  value: ValueGeo | ValueFio | ValueNumber | ValueDatetime;
}

export type ValueDatetime = {
  year?: number;
  year_is_relative?: boolean;
  month?: number;
  month_is_relative?: boolean;
  day?: number;
  day_is_relative?: boolean;
  hour?: number;
  hour_is_relative?: boolean;
  minute?: number;
  minute_is_relative?: boolean;
}

export type ValueNumber = number;

export type ValueFio = {
  first_name?: string;
  last_name?: string;
}

export type ValueGeo = {
  house_number?: string;
  street?: string;
  city?: string;
  country?: string;
}

export type Tokens = {
  end: number;
  start: number;
}

export type Markup = {
  dangerous_context: boolean;
}

export type Meta = {
  client_id: string;
  interfaces?: Interfaces;
  locale: string;
  timezone: string;
}

export type Interfaces = {
  screen?: Screen;
}

export type Screen = {
}

export type Response = {
  text: string;
  tts?: string;
  card?: ImageCard | ListCard;
  buttons?: Button[];
  end_session: boolean;
  proxy?: boolean; // app specified property
  skip_log?: boolean; // app specified property
}

export type Button = {
  title: string;
  payload: Payload;
  url: string;
  hide: boolean;
}

export type ImageCard = {
  type: 'BigImage';
  image_id: string;
  title: string;
  description: string;
  button: CardButton;
}

export type ListCard = {
  type: 'ItemsList';
  header: Header;
  items: Item[];
  footer: Footer;
}

export type CardButton = {
  text: string;
  url: string;
  payload: Payload;
}

export type Footer = {
  text: string;
  button: CardButton;
}

export type Header = {
  text: string;
}

export type Item = {
  image_id: string;
  title: string;
  description: string;
  button: CardButton;
}

export type Payload = any;
