import React, { Component } from 'react';
import { Select, DatePicker, TimePicker } from 'antd';
import OpenChat from "../../sidebar/openchatheader"
import $ from "jquery"
import { toMoment } from '../../../../utils';
import { axiosActions, isFormValid, axiosAction, notify } from '../../../../actions';
import { GET, ADD, DayOptions, UPDATE } from '../../../../constants';
const { Option } = Select;

class EditSchedule extends Component {
  id = this.props.match.params.id;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        "id": null,
        "doctor": null,
        "start": null,
        "end": null,
        "availableDays": '',
        "message": '',
        "retired": false
      },
      doctors: [],
    };
    this.disabledHours = this.disabledHours.bind(this);
    this.disabledMinutes = this.disabledMinutes.bind(this);
    this.onChangeDoctor = this.onChangeDoctor.bind(this);
    this.onChangeAvailableDays = this.onChangeAvailableDays.bind(this);
    this.onChangeStartTime = this.onChangeStartTime.bind(this);
    this.onChangeEndTime = this.onChangeEndTime.bind(this);
    this.onChangeMessage = this.onChangeMessage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.availableDaysDisplay = this.availableDaysDisplay.bind(this);
    this.disabledHours = this.disabledHours.bind(this);
    this.disabledMinutes = this.disabledMinutes.bind(this);
  }

  disabledHours() {
    return [0, 1, 2, 3, 4, 5, 6, 7, 19, 20, 21, 22, 23, 24];
  }

  disabledMinutes(selectHour) {
    if (selectHour == 18)
      return [0, 15, 30, 45];
  }

  onChangeDoctor(val) {
    const tmp = { ...this.state.data };
    tmp.doctor = this.state.doctors.filter(doc => doc.id === val)[0];
    // tmp.doctor = {id : val}
    this.setState({ data: tmp });
  }

  onChangeAvailableDays(val) {
    if (val) {
      const tmp = { ...this.state.data };
      if (Array.isArray(val)) {
        tmp.availableDays = val.join("/");
      }
      this.setState({ data: tmp });
    }
  }

  onChangeStartTime(val) {
    const tmp = { ...this.state.data };
    tmp.start = val
    this.setState({ data: tmp });
  }

  onChangeEndTime(val) {
    const tmp = { ...this.state.data };
    tmp.end = val
    this.setState({ data: tmp });
  }

  onChangeMessage(e) {
    const tmp = { ...this.state.data };
    tmp.message = e.target.value;
    this.setState({ data: tmp });
  }

  disabledHours() {
    return [0, 1, 2, 3, 4, 5, 6, 7, 19, 20, 21, 22, 23, 24];
  }

  disabledMinutes(selectHour) {
    if (selectHour == 18)
      return [0, 15, 30, 45];
  }

  availableDaysDisplay(days) {
    if (days) {
      if (days.includes("/")) {
        return days.split("/");
      }
      return [days];
    }
    return [];

  }

  onSubmit(e) {
    e.preventDefault();
    if (!isFormValid(e)) return;
    // const updateData = {...this.state.data};
    // updateData.doctor = {id : updateData.doctor.id}
    axiosAction(`/schedules/${this.id}`, UPDATE, (res) => {
      notify('success', '', 'Success')
      this.props.history.push(this.props.pushBack);
    }, (err) => notify('error', '', 'Error'), this.state.data);
  }

  componentDidMount() {
    const doctorsParam = {
      url: "/doctors",
      method: GET,
      callback: (res) => {
        this.setState({
          loading: false,
          doctors: res.data
        });
      },
      data: {}
    }

    const scheduleParam = {
      url: `/schedules/${this.id}`,
      method: GET,
      callback: (res) => {
        this.setState({
          loading: false,
          data: res.data
        });
      },
      data: {}
    }

    axiosActions([doctorsParam, scheduleParam]);
  }

  render() {
    return (!this.state.loading &&
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <h4 className="page-title">Edit Schedule</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <form onSubmit={this.onSubmit} className="needs-validation" noValidate>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Doctor Name</label>
                      <Select name='doctor' bordered={false} size={"small"} style={{ width: '100%' }} disabled={this.props.isDoctor}
                        className={this.state.data.doctor != null ? "form-control is-valid" : "form-control is-invalid"} onChange={this.onChangeDoctor} value={this.state.data.doctor?.id}>
                        {this.state.doctors?.map(doctor => {
                          return (<Option key={doctor.id} value={doctor.id}>{doctor.employee.firstName + " " + doctor.employee.lastName}</Option>)
                        })}
                      </Select>
                      <div className="invalid-feedback">Doctor cannot be empty</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Available Days</label>
                      <Select name='availableDays' maxLength={7} mode='multiple' bordered={false} size={"small"} style={{ width: '100%' }}
                        className={this.state.data.availableDays ? "form-control is-valid" : "form-control is-invalid"}
                        optionLabelProp="label" onChange={this.onChangeAvailableDays} value={this.availableDaysDisplay(this.state.data.availableDays)}>
                        {DayOptions?.map((day, idx) => {
                          return (<Option key={idx} value={day.value} label={day.shortLabel} >{day.label}</Option>)
                        })}
                      </Select>
                      <div className="invalid-feedback">Working date cannot be empty</div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Start Time</label>
                      <TimePicker name='start' showSecond={false} format={"HH:mm"} disabledHours={this.disabledHours} disabledMinutes={this.disabledMinutes} className={this.state.data.start ? "form-control is-valid" : "form-control is-invalid"}
                        minuteStep={15} onChange={this.onChangeStartTime} onSelect={this.onChangeStartTime} value={toMoment(this.state.data.start)}></TimePicker>
                      <div className="invalid-feedback">Start time cannot be empty</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>End Time</label>
                      <TimePicker name='end' showSecond={false} format={"HH:mm"} disabledHours={this.disabledHours} disabledMinutes={this.disabledMinutes} className={this.state.data.end ? "form-control is-valid" : "form-control is-invalid"}
                        minuteStep={15} onChange={this.onChangeEndTime} onSelect={this.onChangeEndTime} value={toMoment(this.state.data.end)} 
                        ></TimePicker>
                      <div className="invalid-feedback">End time cannot be empty</div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Note</label>
                  <textarea name='message' cols={30} rows={4} className="form-control" onChange={this.onChangeMessage} value={this.state.data.message} />
                </div>
                <div className="m-t-20 text-center">
                  <button className="btn btn-primary submit-btn" type='submit'>Save</button>
                  <button className="btn btn-danger submit-btn" onClick={() => this.props.history.push(this.props.pushBack)}>Back</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <OpenChat />
      </div>
    );
  }
};

export default EditSchedule;