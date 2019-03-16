import React, {PureComponent} from 'react';
import axios from 'axios'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Row,
  Col,
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
import s from './Profile.scss';

class Profile extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      username: me.type.name,
      data: '',
      email:  '',
      first_name: '',
      last_name: '',
      phone: '',
      address: '',
      address2: '',
      city: '',
      province: '',
      postal_code: '',
      contact_sms: false,
      contact_app: false,
      contact_web: false,
      contact_email: false,
    };
    this.onSubmit= this.onSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFirstChange = this.handleFirstChange .bind(this);
    this.handleLastChange = this.handleLastChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleAddress2Change = this.handleAddress2Change.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleProvinceChange = this.handleProvinceChange.bind(this);
    this.handlePostalCodeChange = this.handlePostalCodeChange.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData(){
    axios.get(`http://192.168.137.135:5000/user/prefrences/${  me.type.name}`)
      .then(response =>
        this.setState({
          email: response.data.email,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          phone: response.data.phone,
          address: response.data.address,
          address2: response.data.address2,
          city: response.data.city,
          province: response.data.province,
          postal_code: response.data.postal_code,
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

  handleFirstChange (e) {
    e.preventDefault();
    this.setState({first_name: e.target.value});
  }

  handleLastChange (e) {
    e.preventDefault();
    this.setState({last_name: e.target.value});
  }

  handlePhoneChange (e) {
    e.preventDefault();
    this.setState({phone: e.target.value});
  }

  handleAddress2Change (e) {
    e.preventDefault();
    this.setState({address2: e.target.value});
  }

  handleAddressChange (e) {
    e.preventDefault();
    this.setState({address: e.target.value});
  }

  handleCityChange (e) {
    e.preventDefault();
    this.setState({city: e.target.value});
  }

  handleProvinceChange (e) {
    e.preventDefault();
    this.setState({province: e.target.value});
  }

  handlePostalCodeChange (e) {
    e.preventDefault();
    this.setState({postal_code: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();
    axios({
      method: 'post',
      url: `http://127.0.0.1:5000/user/prefrences/${  me.type.name}`,
      data: {
        email: this.state.email,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        phone: this.state.phone,
        address: this.state.address,
        address2: this.state.address2,
        city: this.state.city,
        province: this.state.province,
        postal_code: this.state.postal_code,
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
          <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
          <BreadcrumbItem active>Profile</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mb-lg">Profile</h1>
        <Row>
          <Col sm={8}>
            <Widget
              title={
                <h5>
                  Edit Profile <span className="fw-semi-bold" />
                </h5>
              }
            >
              <Form onSubmit={this.onSubmit}>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="input-username">Username</Label>
                      <Input size="lg" type="text" name="username" id="input-username" defaultValue={this.state.username}/>
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
                  <Col sm={3}>
                  <FormGroup>
                    <Label for="input-first-name">First Name</Label>
                    <Input size="lg" type="text" name="first" id="input-first-name" defaultValue={this.state.first_name} onChange={this.handleFirstChange}/>
                  </FormGroup>
                  </Col>
                  <Col sm={3}>
                  <FormGroup>
                    <Label for="input-last-name">Last Name</Label>
                    <Input size="lg" type="text" name="last" id="input-last-name" defaultValue={this.state.last_name} onChange={this.handleLastChange}/>
                  </FormGroup>
                  </Col>
                  <Col sm={6}>
                  <FormGroup>
                    <Label for="input-phone">Phone Number</Label>
                    <Input size="lg" type="text" name="phone" id="input-phone" defaultValue={this.state.phone} onChange={this.handlePhoneChange}/>
                  </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="input-address">Address</Label>
                      <Input size="lg" type="text" name="address" id="input-address" defaultValue={this.state.address} onChange={this.handleAddressChange}/>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="input-address2">Address 2</Label>
                      <Input size="lg" type="text" name="address2" id="input-address2" defaultValue={this.state.address2} onChange={this.handleAddress2Change}/>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="input-city">City</Label>
                      <Input size="lg" type="text" name="city" id="input-city" defaultValue={this.state.city} onChange={this.handleCityChange}/>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="input-province">Province</Label>
                      <Input size="lg" type="text" name="province" id="input-province" defaultValue={this.state.province} onChange={this.handleProvinceChange}/>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="input-postal-code">Postal Code</Label>
                      <Input size="lg" type="text" name="postal-code" id="input-postal-code" defaultValue={this.state.postal_code} onChange={this.handlePostalCodeChange}/>
                    </FormGroup>
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col sm={3}>
                    <div className="d-flex">
                      <div className="abc-checkbox">
                        <Input id="input-contact-web" type="checkbox" checked={this.state.contact_web} onChange={this.toggleWeb}/>
                        <Label for="input-contact-web" />
                      </div>
                      <h5><span>Web App Notifications</span></h5>
                    </div>
                  </Col>
                  <Col sm={3}>
                    <div className="d-flex">
                      <div className="abc-checkbox">
                        <Input id="input-contact-app" type="checkbox" checked={this.state.contact_app} onChange={this.toggleApp}/>
                        <Label for="input-contact-app" />
                      </div>
                      <h5><span>Mobile App Notifications</span></h5>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={3}>
                    <div className="d-flex">
                      <div className="abc-checkbox">
                        <Input id="input-contact-email" type="checkbox" defaultChecked={this.state.contact_email} onChange={this.toggleEmail}/>
                        <Label for="input-contact-email" />
                      </div>
                      <h5><span>Email Notifications</span></h5>
                    </div>
                  </Col>
                  <Col sm={3}>
                    <div className="d-flex">
                      <div className="abc-checkbox">
                        <Input id="input-contact-sms" type="checkbox" defaultChecked={this.state.contact_sms} onChange={this.toggleSMS}/>
                        <Label for="input-contact-sms" />
                      </div>
                      <h5><span>SMS Notifications</span></h5>
                    </div>
                  </Col>
                </Row>
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

export default withStyles(s)(Profile);
