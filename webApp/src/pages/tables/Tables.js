import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios'
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';

import Widget from '../../components/Widget';
import s from './Static.scss';
import me from '../../data/queries/me';
import io from "socket.io-client";
const addr = 'http://127.0.0.1:5000';

class Tables extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [''],

      tableStyles: [
        { date: new Date(''), },
        { date: new Date(''), },
        { date: new Date(''), },
        { date: new Date(''), },
        { date: new Date(''), },
      ],
    };
  }

  getData(){
    axios.get(addr + '/user/notifications/' + me.type.name)
      .then(response =>
        this.setState({
          tableStyles: [{
            id: 1,
            picture: addr + '/user/render_image/' + response.data["0"].photo,
            description: response.data["0"].description,
            date: new Date(response.data["0"].time["$date"]),
            unit: response.data["0"].mpu_id,
          },
            {
              id: 2,
              picture: addr + '/user/render_image/' + response.data["1"].photo,
              description: response.data["1"].description,
              date: new Date(response.data["1"].time["$date"]),
              unit: response.data["1"].mpu_id,
            },
            {
              id: 3,
              picture: addr + '/user/render_image/' + response.data["2"].photo,
              description: response.data["2"].description,
              date: new Date(response.data["2"].time["$date"]),
              unit: response.data["2"].mpu_id,
            },
            {
              id: 4,
              picture: addr + '/user/render_image/' + response.data["3"].photo,
              description: response.data["3"].description,
              date: new Date(response.data["0"].time["$date"]),
              unit: response.data["3"].mpu_id,
            },
            {
              id: 5,
              picture: addr + '/user/render_image/' + response.data["4"].photo,
              description: response.data["4"].description,
              date: new Date(response.data["4"].time["$date"]),
              unit: response.data["4"].mpu_id,
            },
          ]
        }))
  }

  componentDidMount() {
    this.getData();
    const socket = io.connect(addr);

    socket.on('connect', function () {
      console.log("connected to flask socket!");
    });

    socket.on("notification", (response) => {
      if (response.update === true) {
        console.log("updated the table!");
        this.getData();
      }
    });
  }


  parseDate(date) {
    this.dateSet = date.toDateString().split(' ');
    return `${date.toLocaleString('en-us', { month: 'long' })} ${this.dateSet[2]}, ${this.dateSet[3]}`;
  }

  render() {
    return (
      <div>
        <h5> {this.state.response} </h5> <br/>
        <Breadcrumb>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem active>Notifications</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="page-title mb-lg">Notifications</h1>
        <Row>
          <Col sm={12}>
            <Widget
              title={<h5>
                <span className="fw-semi-bold" />
              </h5>} settings close
            >
              <Table borderless className={s.mainTable}>
                <thead>
                <tr>
                  <th className="hidden-sm-down">#</th>
                  <th>Picture</th>
                  <th>Description</th>
                  <th className="hidden-sm-down">Date</th>
                  <th className="hidden-sm-down">unit</th>
                </tr>
                </thead>
                <tbody>
                {
                  this.state.tableStyles.map(row =>
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>
                        <thumbnail>
                          <img className="img-rounded" src={row.picture} alt="" width="200" />
                        </thumbnail>
                      </td>
                      <td>
                        {row.description}
                      </td>
                      <td className="text-semi-muted">
                        {this.parseDate(row.date)}
                      </td>
                      <td className="text-semi-muted">
                        {row.unit}
                      </td>
                    </tr>,
                  )
                }
                </tbody>
              </Table>
            </Widget>
          </Col>
        </Row>
      </div>
    );
  }

}

export default withStyles(s)(Tables);
