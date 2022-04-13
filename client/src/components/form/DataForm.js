import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Formik, Form as FormikForm, FieldArray } from 'formik';
import { dateToString, timeTo24hString } from '../../utils';
import { Card } from '../generic';
import { Divider } from '../generic';

class CustomDataForm extends React.Component {
  state = {}
  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/greeting/latest`, {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'Content-type': 'application/json' },
    }).then((response) =>{
      if (response.ok) {
        response.json().then(({greetingItems})=>{
          // console.log(greetingItems);
          this.setState({ data: greetingItems });
        });
      }
    });
    

 }

 render() {
  if (!this.state.data) {
    return 'loading...'
  }
  // console.log("this.state.data:" + JSON.stringify(this.state.data));
  return (<Grid>
    {(0 < this.state.data.length) && (
    <Box pt={4} pb={4} pl={2} pr={2}>
    <Card>
    <Grid item xs={12}>
    <Typography variant="subtitle2">Previous greeting selections</Typography>
    <Divider />

    <Formik initialValues={this.state.data}>
    <FormikForm>
    <FieldArray
    name="latest_greetings"
    render={arrayHelpers => (
      <table id="previousGreetings">
        <tbody>
          {Object.values(this.state.data).map((greeting_entry, index) => (
            <tr key={index}>
            <td>
              {dateToString((new Date(greeting_entry.createdAt)).toLocaleDateString().toString())}
            </td>
            <td>
              {timeTo24hString((new Date(greeting_entry.createdAt)).toLocaleString().toString())}
            </td>
            <td>
              {greeting_entry.greeting}
            </td>
            
            </tr>
          ))}
        </tbody>
      </table>
    )}
  />
    </FormikForm>
    </Formik>
  </Grid>
    </Card>
  </Box>
    )}</Grid>
  )
 }
};


export const DataForm = CustomDataForm;

