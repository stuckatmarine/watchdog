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
      kind: '',
      data: [],

      tableStyles: [
        {
          id: 1,
          picture: require('../../images/tables/1.jpg'), // eslint-disable-line global-require
          description: 'Palo Alto',
          info: {
            type: 'JPEG',
            dimensions: '200x150',
          },
          date: new Date('September 14, 2012'),
          size: '45.6 KB',
          progress: {
            percent: 29,
            colorClass: 'success',
          },
        },
        {
          id: 2,
          picture: require('../../images/tables/2.jpg'), // eslint-disable-line global-require
          description: 'The Sky',
          info: {
            type: 'PSD',
            dimensions: '2400x1455',
          },
          date: new Date('November 14, 2012'),
          size: '15.3 MB',
          progress: {
            percent: 33,
            colorClass: 'warning',
          },
        },
        {
          id: 3,
          picture: require('../../images/tables/3.jpg'), // eslint-disable-line global-require
          description: 'Down the road',
          label: {
            colorClass: 'success',
            text: 'INFO!',
          },
          info: {
            type: 'JPEG',
            dimensions: '200x150',
          },
          date: new Date('September 14, 2012'),
          size: '49.0 KB',
          progress: {
            percent: 38,
            colorClass: 'inverse',
          },
        },
        {
          id: 4,
          picture: require('../../images/tables/4.jpg'), // eslint-disable-line global-require
          description: 'The Edge',
          info: {
            type: 'PNG',
            dimensions: '210x160',
          },
          date: new Date('September 15, 2012'),
          size: '69.1 KB',
          progress: {
            percent: 17,
            colorClass: 'danger',
          },
        },
        {
          id: 5,
          picture: require('../../images/tables/5.jpg'), // eslint-disable-line global-require
          description: 'Fortress',
          info: {
            type: 'JPEG',
            dimensions: '1452x1320',
          },
          date: new Date('October 1, 2012'),
          size: '2.3 MB',
          progress: {
            percent: 41,
            colorClass: 'primary',
          },
        },
      ],
    };
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:5000/user/notifications/user')
      .then(response => console.log(response))
      .then(({ data })=> {
        this.setState({
          kind: data.kind,
          data: data.data.children
        });
      })
      .catch((err)=> {})
  }

  parseDate(date) {
    this.dateSet = date.toDateString().split(' ');
    return `${date.toLocaleString('en-us', { month: 'long' })} ${this.dateSet[2]}, ${this.dateSet[3]}`;
  }

  render() {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
          <BreadcrumbItem active>Tables Basic</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="page-title mb-lg">Tables - <span className="fw-semi-bold">Basic</span></h1>
        <Row>
          <Col sm={12}>
            <Widget
              title={<h5>
                Table <span className="fw-semi-bold">Styles</span>
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
                  <th className="hidden-sm-down">Size</th>
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
                        {row.size}
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
