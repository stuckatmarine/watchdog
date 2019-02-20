import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios'
import {
  Row,
  Col,
  Table,
  Progress,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';

import Widget from '../../components/Widget';
import s from './Static.scss';

class Tables extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [''],

      tableStyles: [
        { info: {type: '', dimensions: '', }, date: new Date(''), progress: { percent: 0, }, },
        { info: {type: '', dimensions: '', }, date: new Date(''), progress: { percent: 0, }, },
        { info: {type: '', dimensions: '', }, date: new Date(''), progress: { percent: 0, }, },
        { info: {type: '', dimensions: '', }, date: new Date(''), progress: { percent: 0, }, },
        { info: {type: '', dimensions: '', }, date: new Date(''), progress: { percent: 0, }, },
      ],
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData(){
    axios.get('http://127.0.0.1:5000/user/notifications/username')
      .then(response =>
        this.setState({
          tableStyles: [{
            id: 1,
            picture: response.data["0"].photo,
            description: response.data["0"].description,
            info: {
              type: 'JPEG',
              dimensions: '200x150',
            },
            date: new Date('September 14, 2012'),
            unit: response.data["0"].mpu_id,
            progress: {
              percent: 29,
              colorClass: 'success',
            },
          },
            {
              id: 2,
              picture: response.data["1"].photo,
              description: response.data["1"].description,
              info: {
                type: 'PSD',
                dimensions: '2400x1455',
              },
              date: new Date('November 14, 2012'),
              unit: response.data["1"].mpu_id,
              progress: {
                percent: 33,
                colorClass: 'warning',
              },
            },
            {
              id: 3,
              picture: response.data["2"].photo,
              description: response.data["2"].description,
              label: {
                colorClass: 'success',
                text: 'INFO!',
              },
              info: {
                type: 'JPEG',
                dimensions: '200x150',
              },
              date: new Date('September 14, 2012'),
              unit: response.data["2"].mpu_id,
              progress: {
                percent: 38,
                colorClass: 'inverse',
              },
            },
            {
              id: 4,
              picture: response.data["3"].photo,
              description: response.data["3"].description,
              info: {
                type: 'PNG',
                dimensions: '210x160',
              },
              date: new Date('September 15, 2012'),
              unit: response.data["3"].mpu_id,
              progress: {
                percent: 17,
                colorClass: 'danger',
              },
            },
            {
              id: 5,
              picture: response.data["4"].photo,
              description: response.data["4"].description,
              info: {
                type: 'JPEG',
                dimensions: '1452x1320',
              },
              date: new Date('October 1, 2012'),
              unit: response.data["4"].mpu_id,
              progress: {
                percent: 41,
                colorClass: 'primary',
              },
            },
          ]
        }))
  }

  parseDate(date) {
    this.dateSet = date.toDateString().split(' ');
    return `${date.toLocaleString('en-us', { month: 'long' })} ${this.dateSet[2]}, ${this.dateSet[3]}`;
  }

  render() {
    return (
      //<div> {this.state.data} </div>
      <div>
        <Breadcrumb>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem active>Notifications</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="page-title mb-lg">Notifications</h1>
        <Row>
          <Col sm={12}>
            <Widget
              title={<h5>
                <span className="fw-semi-bold"></span>
              </h5>} settings close
            >
              <Table borderless className={s.mainTable}>
                <thead>
                <tr>
                  <th className="hidden-sm-down">#</th>
                  <th>Picture</th>
                  <th>Description</th>
                  <th className="hidden-sm-down">Info</th>
                  <th className="hidden-sm-down">Date</th>
                  <th className="hidden-sm-down">unit</th>
                  <th />
                </tr>
                </thead>
                <tbody>
                {
                  this.state.tableStyles.map(row =>
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>
                        <img className="img-rounded" src={row.picture} alt="" height="60" />
                      </td>
                      <td>
                        {row.description}
                        {row.label &&
                        <div>
                          <Badge color={row.label.colorClass}>{row.label.text}</Badge>
                        </div>
                        }
                      </td>
                      <td>
                        <p className="mb-0">
                          <small>
                            <span className="fw-semi-bold">Type:</span>
                            <span className="text-muted">&nbsp; {row.info.type}</span>
                          </small>
                        </p>
                        <p>
                          <small>
                            <span className="fw-semi-bold">Dimensions:</span>
                            <span className="text-muted">&nbsp; {row.info.dimensions}</span>
                          </small>
                        </p>
                      </td>
                      <td className="text-semi-muted">
                        {this.parseDate(row.date)}
                      </td>
                      <td className="text-semi-muted">
                        {row.unit}
                      </td>
                      <td className="width-150">
                        <Progress
                          style={{height: '7px'}}
                          color="success" value={row.progress.percent}
                          className="progress-sm mb-xs rounded mt-xs"
                        />
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
