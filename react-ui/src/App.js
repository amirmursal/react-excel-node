import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      file: "",
      filename: "",
      reportType: "Baptiste",
      loading: false
    };
  }

  /**
   * Handle report type change
   * @param event
   */
  handleReportTypeChange = event => {
    this.setState({
      reportType: event.target.value
    });
  };

  /**
   * Handle file uplaod change
   * Create filename with todays date attached
   * @param event
   */
  handleUploadFile = event => {
    if (
      !event ||
      !event.target ||
      !event.target.files ||
      event.target.files.length === 0
    ) {
      return;
    }

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();

    today = dd + "/" + mm + "/" + yyyy;

    const name = event.target.files[0].name;
    const lastDot = name.lastIndexOf(".");

    const fileName = name.substring(0, lastDot) + " " + today;

    this.setState({
      file: event.target.files[0],
      filename: fileName
    });
  };

  /**
   * Upload file to node api
   * get json response as excel data
   *
   */
  processFile = () => {
    const data = new FormData();
    data.append("file", this.state.file);
    this.setState({
      loading: true
    });
    axios.post("/upload", data).then(response => {
      this.setState({
        data: response.data,
        loading: false
      });
    });
  };

  /**
   * Render Cloud9 report data
   */

  renderCloud9Data = () => {
    return this.state.data.map((element, i) => {
      if (element.A !== "" && i > 7) {
        let current = this.state.data[i + 2];
        return (
          <tr key={i}>
            <td>{element.A}</td>
            <td>{current.B}</td>
            <td>{element.H}</td>
            <td>{current.O}</td>
            <td>{current.P}</td>
            <td>{current.R}</td>
            <td>{current.T}</td>
            <td>{current.U}</td>
            <td>{current.W}</td>
            <td>{current.X}</td>
            <td>{current.Y}</td>
            <td>{current.Z}</td>
          </tr>
        );
      }
    });
  };

  /**
   * Render Ortho2Ege report Data
   */
  renderOrtho2EgeData = () => {
    return this.state.data.map((element, i) => {
      if (element.A !== "" && i > 7 && element.B !== "") {
        return (
          <tr key={i}>
            <td>{element.A}</td>
            <td>{element.B}</td>
            <td>{element.C}</td>
            <td>{element.E}</td>
            <td>{element.F}</td>
            <td>{element.G}</td>
            <td>{element.H}</td>
            <td>{element.I}</td>
            <td>{element.J}</td>
            <td>{element.K}</td>
            <td>{element.M}</td>
            <td>{element.O}</td>
            <td>{element.Q}</td>
            <td>{element.R}</td>
          </tr>
        );
      }
    });
  };

  /**
   * Render Dolphin report data
   */
  renderDolphinData = () => {
    let locationName;
    return this.state.data.map((element, i) => {
      if (element.G !== "" && element.A === "") {
        locationName = element.G;
      }
      if (
        element.A !== "" &&
        i > 9 &&
        element.A !== "Pat ID" &&
        locationName !== element.A &&
        element.H !== ""
      ) {
        return (
          <tr key={i}>
            <td>{locationName}</td>
            <td>{element.A}</td>
            <td>{element.D}</td>
            <td>{element.H}</td>
            <td>{element.M}</td>
            <td>{element.N}</td>
            <td>{element.P}</td>
            <td>{element.Q}</td>
            <td>{element.R}</td>
            <td>{element.S}</td>
            <td>{element.T}</td>
            <td>{element.U}</td>
            <td>{element.X}</td>
            <td>{element.AA}</td>
            <td>{element.AC}</td>
          </tr>
        );
      }
    });
  };

  /**
   * Render Baptiste report data
   */
  renderBaptisteData = () => {
    let pname;
    return this.state.data.map((element, i) => {
      let previous = this.state.data[
        i === 0 ? this.state.data.length - 1 : i - 1
      ];
      let current = this.state.data[i];
      let next = this.state.data[i + 1];
      if (element.A !== "" && next && next.A !== "") {
        if (previous.A === "") {
          pname = current.A;
        }
        return (
          <tr key={i}>
            <td>{pname}</td>
            <td>{next.A}</td>
            <td>{current.B}</td>
            <td>{current.C}</td>
            <td>{current.D}</td>
            <td>{current.E}</td>
            <td>{current.F}</td>
            <td>{current.G}</td>
            <td>{current.H}</td>
            <td>{current.I}</td>
            <td>{current.J}</td>
            <td>{current.K}</td>
            <td>{current.L}</td>
            <td>{current.M}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        );
      }
    });
  };

  /**
   * Export html table to formatted excel file
   * @param table - id of HMTL table
   * @param name - downloadble file name
   */
  tableToExcel = (table, name) => {
    var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
    var j = 0;
    var tab = document.getElementById(table);
    if (tab == null) {
      return false;
    }
    if (tab.rows.length === 0) {
      return false;
    }

    for (j = 0; j < tab.rows.length; j++) {
      tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
    }

    tab_text = tab_text + "</table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./)) {
      // If Internet Explorer
      var txtArea1;
      txtArea1.document.open("txt/html", "replace");
      txtArea1.document.write(tab_text);
      txtArea1.document.close();
      txtArea1.focus();
      txtArea1.document.execCommand("SaveAs", true, name + ".xlsx");
    } //other browser not tested on IE 11
    else
      try {
        var blob = new Blob([tab_text], { type: "application/vnd.ms-excel" });
        window.URL = window.URL || window.webkitURL;
        var link = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        if (document.getElementById("caption") != null) {
          a.download = document.getElementById("caption").innerText;
        } else {
          a.download = name;
        }

        a.href = link;

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);
      } catch (e) {}
    this.setState({
      data: [],
      file: "",
      filename: "",
      reportType: "Baptiste"
    });
    this.refs.file.value = "";
    return false;
  };

  render() {
    const { data, file, filename, loading } = this.state;
    const isBaptiste = data.length > 0 && this.state.reportType === "Baptiste";
    const isDolphin = data.length > 0 && this.state.reportType === "Dolphin";
    const isOrtho2Ege =
      data.length > 0 && this.state.reportType === "Ortho2Ege";
    const isCloud9 = data.length > 0 && this.state.reportType === "Cloud9";
    return (
      <div className="container-fluid">
        <br />
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <input
                ref="file"
                type="file"
                className="form-control-file"
                onChange={this.handleUploadFile}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-control"
                value={this.state.reportType}
                onChange={this.handleReportTypeChange}
              >
                <option value="Baptiste">Baptiste</option>
                <option value="Dolphin">Dolphin</option>
                <option value="Ortho2Ege">Ortho2Ege</option>
                <option value="Cloud9">Cloud 9</option>
                <option value="Smilelink">Smilelink</option>
              </select>
            </div>
            {file && (
              <div className="col-md-3">
                <button
                  className="form-control btn btn-primary"
                  onClick={this.processFile}
                >
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}{" "}
                  Process File
                </button>
              </div>
            )}
            {data.length > 0 && (
              <div className="col-md-3">
                <button
                  className="form-control btn btn-success"
                  onClick={() => this.tableToExcel("table-to-xls", filename)}
                >
                  Export to Excel
                </button>
              </div>
            )}
          </div>
        </div>

        <br />
        <div>
          {isBaptiste && (
            <div className="container-fluid">
              <table
                className="table table-bordered table-sm"
                id="table-to-xls"
              >
                <thead className="thead-light">
                  <tr>
                    <th>Patient</th>
                    <th>Subscriber</th>
                    <th>Phone#</th>
                    <th>Initial</th>
                    <th>Previous Charge</th>
                    <th>Charge Amount</th>
                    <th>Total Balance</th>
                    <th>Current Due</th>
                    <th>This Month</th>
                    <th>31-60 days</th>
                    <th>61-90 days</th>
                    <th>91+ days</th>
                    <th>Last Payment</th>
                    <th>Payment Date</th>
                    <th>Ageing</th>
                    <th>Last seen</th>
                    <th>Next Appt</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>{this.renderBaptisteData()}</tbody>
              </table>
            </div>
          )}

          {isDolphin && (
            <div className="container-fluid">
              <table
                className="table table-bordered table-sm"
                id="table-to-xls"
              >
                <thead className="thead-light">
                  <tr>
                    <th>Location</th>
                    <th>Pat ID</th>
                    <th>Billing Party</th>
                    <th>Patient</th>
                    <th>Current</th>
                    <th>Over 30</th>
                    <th>Over 60</th>
                    <th>Over 90</th>
                    <th>Past Due</th>
                    <th>Total Due</th>
                    <th>Unbilled</th>
                    <th>Acct Bal</th>
                    <th>Amt</th>
                    <th>Date</th>
                    <th>Chg</th>
                  </tr>
                </thead>
                <tbody>{this.renderDolphinData()}</tbody>
              </table>
            </div>
          )}

          {isOrtho2Ege && (
            <div className="container-fluid">
              <table
                className="table table-bordered table-sm"
                id="table-to-xls"
              >
                <thead className="thead-light">
                  <tr>
                    <th>Patient</th>
                    <th>Sts</th>
                    <th>Responsible Party</th>
                    <th>Home Ph</th>
                    <th>Work Ph</th>
                    <th>Amt Due</th>
                    <th>0-30</th>
                    <th>31-60</th>
                    <th>61-90</th>
                    <th>91+</th>
                    <th>Days</th>
                    <th>Balance</th>
                    <th>Last Amt</th>
                    <th>Received</th>
                  </tr>
                </thead>
                <tbody>{this.renderOrtho2EgeData()}</tbody>
              </table>
            </div>
          )}

          {isCloud9 && (
            <div className="container-fluid">
              <table
                className="table table-bordered table-sm"
                id="table-to-xls"
              >
                <thead className="thead-light">
                  <tr>
                    <th>Patient</th>
                    <th>Subscriber</th>
                    <th>Contact Info</th>
                    <th>Last Pay. Date</th>
                    <th>Last Pay. Amt.</th>
                    <th>> 10</th>
                    <th>0-30</th>
                    <th>31-60</th>
                    <th>61-90</th>
                    <th>> 90</th>
                    <th>Due Now</th>
                    <th>Total Due</th>
                  </tr>
                </thead>
                <tbody>{this.renderCloud9Data()}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
