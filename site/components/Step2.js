import { TextInput, FormField, Heading, Button, Box } from 'grommet';

const Step2 = (props) => (
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
      label="Придумай секретное слово"
      htmlFor="text-input"
      help="Его нужно будет произнести Алисе чтобы получить доступ к навыку"
    >
      <TextInput
        id="text-input"
        placeholder="..."
        value={props.secret}
        onChange={props.onChangeSecret}
      />
    </FormField>
    <Button label="Назад" onClick={props.goBack} />
    <Button label="Продолжить" onClick={props.goForward} />
  </Box>
);

export default Step2;
