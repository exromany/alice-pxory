export type Question = {
  meta: Meta;
  request: Request;
  session: QuestionSession;
  version: Version;
}

export type Answer = {
  response: Response;
  session: AnswerSesstion;
  version: Version;
}

export type QuestionSession = {
  new: boolean;
  message_id: number;
  session_id: string;
  skill_id: string;
  user_id: string;
}

export type Version = string;

export type AnswerSesstion = Pick<QuestionSession, 'session_id' | 'skill_id' | 'user_id'>;

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
} & (EntityGeo | EntityFio | EntityDatetime | EntityNumber);

export type EntityDatetime = {
  type: 'YANDEX.DATETIME';
  value: ValueDatetime;
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

export type EntityNumber = {
  type: 'YANDEX.NUMBER';
  value: ValueNumber;
}

export type ValueNumber = number;

export type EntityFio = {
  type: 'YANDEX.FIO';
  value: ValueFio;
}

export type ValueFio = {
  first_name?: string;
  last_name?: string;
}

export type EntityGeo = {
  type: 'YANDEX.GEO';
  value: ValueGeo;
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
}

export type Button = {
  title: string;
  payload?: Payload;
  url?: string;
  hide?: boolean;
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
