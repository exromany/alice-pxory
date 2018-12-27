import { Component } from "react";
import { TextInput, FormField, Heading, Button, Box } from 'grommet';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

export default class RegistrationForm extends Component {
  state = {
    step: 1,
    url: '',
    urlError: null,
    secret: '',
    onChangeUrl: (e) => this.onChangeUrl(e),
    onChangeSecret: (e) => this.onChangeSecret(e),
    goForward: () => this.goForward(),
    goBack: () => this.goBack(),
  };

  goForward = () => {
    let { step } = this.state;
    if (step < 3) {
      step += 1;
    }
    this.setState({ step })
  }

  goBack = () => {
    let { step } = this.state;
    if (step > 1) {
      step -= 1;
    }
    this.setState({ step })
  }

  onChangeUrl = event => {
    const {
      target: { value }
    } = event;
    this.setState({ url: value });
  };

  onChangeSecret = event => {
    const {
      target: { value }
    } = event;
    this.setState({ secret: value });
  };

  render() {
    const { step } = this.state;
    return (
      <Box
        pad="large"
        align="center"
        background={{ color: "light-2", opacity: "strong" }}
        round
        gap="small"
        {...this.props}
      >
        {step === 1 && <Step1 {...this.state} />}
        {step === 2 && <Step2 {...this.state} />}
        {step === 3 && <Step3 {...this.state} />}
      </Box>
    );
  }
}
