import React, { useState, useEffect, useContext } from "react";
import "./styles.scss";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from '@mui/material/Checkbox';
import { Button, Input } from "cx-portal-shared-components";
import { getReportsByCompanyUser } from "../../services/reports-api";
import UserService from "../../services/UserService";
import { CountryContext } from "../../../contexts/country";
import { CompanyUserContext } from "../../../contexts/companyuser";
import { ReportContext } from "../../../contexts/reports";
import { DataGrid } from '@mui/x-data-grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup'

const Reports = () => {

    const [selectionModel, setSelectionModel] = useState([]);

    //Context to get current selected country
    const { countryS, updateCountry } = useContext(CountryContext);

    //Context to save report data
    const { report, updateReport } = useContext(ReportContext);

    const { companyUser, updateCompanyUser } = useContext(CompanyUserContext);

    const [reports, setReport] = useState(["teste"]);

    const [open, setOpen] = React.useState(false);

    const [valueRadio, setValueRadio] = React.useState('OnlyMe');

    const [selectedDataTable, setselectedDataTable] = useState([]);

    const [valueTextField, setValueTextField] = React.useState('Select an Report Bellow');

    //Get Reports By user 
    useEffect(() => {
        getReportsByCompanyUser(UserService.getToken(), companyUser).then((response) => {
            console.log(response);
        });
    }, []);

    const closeDialogs = () => {
        setOpen(false);
    };
    const openDialog = () => {
        setOpen(!open);
    };

    //Handler for Checkbox
    const handleChangeCheckbox = (event) => {
        console.log(event.target.value)
        setValueRadio(event.target.value)
    };

    //Handler for Input Report name in Dialog Component
    const handleInputReportChange = (event) => {
        if (event.target.value.length > 32 || event.target.value.length === 0) {
            //Needs to throw error
            console.log("error")
        } else {
            console.log(event.target.value)
        }
    };

    //Handler for textvalue in main report component
    const handleChangeInput = (event) => {
        setValueTextField(event.target.value);
      };

    //Test Values Only
    const columns = [
        {
            field: 'reportSavedName',
            headerName: 'Saved Reports',
            sortable: false,
            width: 200,
        },
    ];

    //Test Values Only
    const rows = [
        { id: 1, reportSavedName: 'Teste' },
        { id: 2, reportSavedName: 'Teste2.0' },
    ];

                        /*<Select
                        value={reports}
                        label="Reports"
                    >
                        {Array.isArray(reports)
                            ? reports.map((item) => {
                                return (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                );
                            })
                            : []}
                    </Select>*/

    return (
        <div className="reportdiv">
            <div className="reports-header">
                <TextField className="formReports" variant="filled"
                value={valueTextField}
                onChange = {handleChangeInput}>
                </TextField>
                <div className="divider" />
                <Button size="small" className="ButtonSave" onClick={openDialog}>
                    Save Reports
                </Button>
            </div>
            <DataGrid className="table"
                rows={rows}
                columns={columns}
                pageSize={5}
                headerHeight={0}
                rowsPerPageOptions={[5]}
                checkboxSelection={true}
                hideFooter
                selectionModel={selectionModel}
                autoHeight={true}
                onSelectionModelChange={(selection) => {
                    if(rows[selection.at(-1) - 1 ] === undefined){
                        setValueTextField('Select an Report Bellow')
                    }else{
                        setValueTextField(rows[selection.at(-1) - 1 ].reportSavedName)
                    }
                    if (selection.length > 1) {
                        const selectionSet = new Set(selectionModel);
                        const result = selection.filter((s) => !selectionSet.has(s));
                        setSelectionModel(selectionModel.length ? result : []);
                    } else {
                        setSelectionModel(selection);
                    }
                }}
            />

            <Dialog open={open} onClose={closeDialogs} className="Dialog-Expand" >
                <div className="Dialog-Expand-Div">

                    <FormLabel className="FirstLabel" component="legend">Select availability</FormLabel>
                    <div className="CheckBox-Div">
                        <RadioGroup className="CheckBox-Div-Radio"
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={valueRadio}
                            onChange={handleChangeCheckbox}
                        >
                            <FormControlLabel value="OnlyMe" control={<Radio />} label="Only For me" />
                            <FormControlLabel value="Company" control={<Radio />} label="For the company" />
                        </RadioGroup>
                    </div>

                    <FormLabel className="SecondLabel" component="legend">Please input the name of the Report</FormLabel>

                    <Input className="input-report"

                        helperText="Helper"
                        placeholder="Max 32 Characters"
                        size={"small"}
                        onChange={handleInputReportChange}
                    ></Input>


                    <Button style={{ margin: "1%" }} onClick={closeDialogs}>
                        Close
                    </Button>
                    <Button style={{ margin: "1%" }} onClick={closeDialogs}>
                        Save
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default Reports;
