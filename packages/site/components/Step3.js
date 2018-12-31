import { Text, Heading, Button, Box } from 'grommet';

const Step3 = ({ id, secret }) => (
  <Box
    align="center"
    gap="small"
  >
    <Heading
      size="small"
    >
      Навык зарегистрирован!
    </Heading>
    <Text>
      Как запустить:<br />
      - Слушай Алиса<br />
      - Запусти навык тестилка<br />
      - <b>{id}</b><br />
      - <b>{secret}</b><br />
    </Text>
  </Box>
);

export default Step3;
