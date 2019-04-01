import React, {PureComponent} from 'react';
import axios from 'axios'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Row,
  Col,
  CustomInput,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ButtonGroup,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';

import Widget from '../../components/Widget';
import me from '../../data/queries/me';
import s from './Notifications.scss';
const addr = 'http://192.168.43.7:5000';

class Notifications extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      username: me.type.name,
      data: '',
      email:  '',
      start_time: '',
      interval: '',
      phone: '',
      end_time: '',
      v_flip: false,
      h_flip: false,
      object: [],
      min_confidence: '',
      contact_sms: false,
      contact_app: false,
      contact_web: false,
      contact_email: false,
    };
    this.onSubmit= this.onSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.toggleVFlip = this.toggleVFlip.bind(this);
    this.toggleHFlip = this.toggleHFlip.bind(this);
    this.handleObjectChange = this.handleObjectChange.bind(this);
    this.handleMinConfidenceChange = this.handleMinConfidenceChange.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData(){
    axios.get(addr + '/user/prefrences/' +  me.type.name)
      .then(response =>
        this.setState({
          email: response.data.email,
          phone: response.data.phone,
          interval: response.data.mpuid.interval,
          start_time: response.data.mpuid.startTime,
          end_time: response.data.mpuid.endTime,
          v_flip: response.data.mpuid.vFlip,
          h_flip: response.data.mpuid.hFlip,
          object: response.data.mpuid.classNames,
          min_confidence: response.data.mpuid.minConfidence,
          contact_sms: response.data.contact_sms,
          contact_app: response.data.contact_app,
          contact_web: response.data.contact_web,
          contact_email: response.data.contact_email,
        }))
  }

  toggleWeb = e => {
    this.setState(prevState => ({
      contact_web: !prevState.contact_web
    }));
  };

  toggleApp = e => {
    this.setState(prevState => ({
      contact_app: !prevState.contact_app
    }));
  };

  toggleEmail = e => {
    this.setState(prevState => ({
      contact_email: !prevState.contact_email
    }));
  };

  toggleSMS= e => {
    this.setState(prevState => ({
      contact_sms: !prevState.contact_sms
    }));
  };

  handleEmailChange (e) {
    e.preventDefault();
    this.setState({email: e.target.value});
  }

  handleStartChange (e) {
    e.preventDefault();
    this.setState({start_time: e.target.value});
  }

  handleIntervalChange (e) {
    e.preventDefault();
    this.setState({interval: e.target.value});
  }

  handlePhoneChange (e) {
    e.preventDefault();
    this.setState({phone: e.target.value});
  }

  toggleVFlip= e => {
    this.setState(prevState => ({
      v_flip: !prevState.v_flip
    }));
  };

  handleEndTimeChange (e) {
    e.preventDefault();
    this.setState({end_time: e.target.value});
  }
  toggleHFlip= e => {
    this.setState(prevState => ({
      h_flip: !prevState.h_flip
    }));
  };

  handleObjectChange (e) {
    e.preventDefault();
    this.setState({object: [e.target.value]});
  }

  handleMinConfidenceChange (e) {
    e.preventDefault();
    this.setState({min_confidence: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();
    axios({
      method: 'post',
      url: addr + '/user/settings/' + me.type.name,
      data: {
        email: this.state.email,
        start_time: this.state.start_time,
        interval: this.state.interval,
        phone: this.state.phone,
        end_time: this.state.end_time,
        v_flip: this.state.v_flip,
        h_flip: this.state.h_flip,
        object: this.state.object,
        min_confidence: this.state.min_confidence,
        contact_sms: this.state.contact_sms,
        contact_app: this.state.contact_app,
        contact_web: this.state.contact_web,
        contact_email: this.state.contact_email,
      },
      headers: {
        "Content-Type": "application/json"
      },
    })
  }

  render() {
    return (
      <div className={s.root}>
        <Breadcrumb>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem active>Notification Settings</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mb-lg">Notification Settings</h1>
        <Row>
          <Col sm={8}>
            <Widget
              title={
                <h5>
                  Edit Notifications <span className="fw-semi-bold" />
                </h5>
              }
            >
              <br/>
              <Form onSubmit={this.onSubmit}>
                <Row>
                  <Col sm={4}>
                    <div className="d-flex">
                      <CustomInput id="input-contact-email" type="switch" checked={this.state.contact_email} onChange={this.toggleEmail} />
                      <Label for="input-contact-email" />
                      <h5><span>Email Notifications</span></h5>
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="d-flex">
                      <CustomInput id="input-contact-sms" type="switch" checked={this.state.contact_sms} onChange={this.toggleSMS}/>
                      <Label for="input-contact-sms" />
                      <h5><span>SMS Notifications</span></h5>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={4}>
                    <div className="d-flex">
                      <CustomInput id="input-contact-web" type="switch" checked={this.state.contact_web} onChange={this.toggleWeb}/>
                      <Label for="input-contact-web" />
                      <h5><span>Web App Notifications</span></h5>
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="d-flex">
                      <CustomInput id="input-contact-app" type="switch" checked={this.state.contact_app} onChange={this.toggleApp}/>
                      <Label for="input-contact-app" />
                      <h5><span>Mobile App Notifications</span></h5>
                    </div>
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="input-email">Phone Number</Label>
                      <Input size="lg" type="text" name="phone" id="input-phone" defaultValue={this.state.phone} onChange={this.handlePhoneChange}/>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="input-email">Email</Label>
                      <Input size="lg" type="email" name="email" id="input-email" defaultValue={this.state.email} onChange={this.handleEmailChange}/>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm={4}>
                    <FormGroup>
                      <Label for="input-first-name">Start Time</Label>
                      <Input size="lg" type="text" name="start" id="input-start-time" defaultValue={this.state.start_time} onChange={this.handleStartChange}/>
                    </FormGroup>
                  </Col>
                  <Col sm={4}>
                    <FormGroup>
                      <Label for="input-end_time">End Time</Label>
                      <Input size="lg" type="text" name="end_time" id="input-end_time" defaultValue={this.state.end_time} onChange={this.handleEndTimeChange}/>
                    </FormGroup>
                  </Col>
                  <Col sm={4}>
                    <FormGroup>
                      <Label for="input-phone">Photo Interval</Label>
                      <Input size="lg" type="text" name="interval" id="input-interval" defaultValue={this.state.interval} onChange={this.handleIntervalChange}/>
                    </FormGroup>
                  </Col>
                </Row>
                <Row sm={10}>
                  <Col sm={5}>
                    <FormGroup>
                      <Label for="objects">Object to Detect</Label>
                      <Input
                        type="select"
                        name="objects"
                        size="11"
                        id="objects"
                        defaultValue={this.state.object}
                        value={this.state.object}
                        onChange={this.handleObjectChange}
                        multiple
                      >
                        <option value="aeroplane">aeroplane</option>
                        <option value="bicycle">bicycle</option>
                        <option value="bird">bird</option>
                        <option value="boat">boat</option>
                        <option value="bottle">bottle</option>
                        <option value="bus">bus</option>
                        <option value="car">car</option>
                        <option value="cat">cat</option>
                        <option value="chair">chair</option>
                        <option value="cow">cow</option>
                        <option value="diningtable">dining table</option>
                        <option value="dog">dog</option>
                        <option value="horse">horse</option>
                        <option value="motorbike">motorbike</option>
                        <option value="person">person</option>
                        <option value="pottedplant">potted plant</option>
                        <option value="sheep">sheep</option>
                        <option value="sofa">sofa</option>
                        <option value="train">train</option>
                        <option value="tvmonitor">tv monitor</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col sm={4}>
                    <Row>
                      <br/>
                    </Row>
                    <Row>
                      <div className="d-flex">
                        <CustomInput type="switch" id="input-v_flip" checked={this.state.v_flip} onChange={this.toggleVFlip} />
                        <Label for="input-v_flip" />
                        <h5><span>Vertical Flip Image</span></h5>
                      </div>
                    </Row>
                    <Row>
                      <div className="d-flex">
                        <CustomInput type="switch" id="input-h_flip" checked={this.state.h_flip} onChange={this.toggleHFlip} />
                        <Label for="input-h_flip" />
                        <h5><span>Horizontal Flip Image</span></h5>
                      </div>
                    </Row>
                    <Row>
                      <br/>
                      <br/>
                      <br/>
                      <br/>
                      <br/>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Label for="input-postal-code">Minimum Confidence</Label>
                        <Input size="lg" type="text" name="min-confidence" id="input-min-confidence" defaultValue={this.state.min_confidence} onChange={this.handleMinConfidenceChange}/>
                      </FormGroup>
                    </Row>
                  </Col>
                </Row>
                <br/>
                <div className="d-flex justify-content-end">
                  <Row>
                    <Col>
                      <ButtonGroup className="pull-right">
                        <Button onSubmit={this.onSubmit} color="danger">Save</Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                </div>
              </Form>
            </Widget>
          </Col>
        </Row>
      </div>
    )
  }
}

export default withStyles(s)(Notifications);
