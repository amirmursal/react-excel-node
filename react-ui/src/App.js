import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filename: ""
    };
  }

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

    const data = new FormData();
    data.append("file", event.target.files[0]);
    axios.post("/upload", data).then(response => {
      this.setState({
        data: response.data,
        filename: fileName
      });
    });
  };

  renderData = () => {
    let pname;
    return this.state.data.map((element, i) => {
      let previous = this.state.data[
        i === 0 ? this.state.data.length - 1 : i - 1
      ];
      let current = this.state.data[i];
      let next = this.state.data[i + 1];
      if (element.A !== "" && next.A !== "") {
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
          </tr>
        );
      }
    });
  };

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

    return false;
  };

  render() {
    const { data, filename } = this.state;
    return (
      <div>
        <input type="file" onChange={this.handleUploadFile} />
        <br /> <br />
        {data.length > 0 && (
          <div>
            <input
              type="button"
              onClick={() => this.tableToExcel("table-to-xls", filename)}
              value="Export to Excel"
            />

            <table id="table-to-xls">
              <thead>
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
              <tbody>{this.renderData()}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default App;
