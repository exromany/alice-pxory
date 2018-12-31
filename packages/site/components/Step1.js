import { TextInput, FormField, Heading, Button, Box } from 'grommet';

const Step1 = (props) => (
  <Box
    align="center"
    gap="small"
  >
    <Heading
      size="small"
    >
      Регистрация навыка
    </Heading>
    <FormField
      label="Укажи webhook URL"
      htmlFor="text-input"
      help="Адрес, на который будут отправляться запросы"
      error={props.urlError}
    >
      <TextInput
        id="text-input"
        placeholder="http://"
        value={props.url}
        onChange={props.onChangeUrl}
      />
    </FormField>
    <Button label="Продолжить" onClick={props.goForward} />
  </Box>
);

export default Step1;
