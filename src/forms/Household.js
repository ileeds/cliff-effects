// REACT COMPONENTS
import React from 'react';
import {
  Button,
  Form,
  Dropdown,
  Header,
  Checkbox,
  Icon,
  Input
} from 'semantic-ui-react';

// PROJECT COMPONENTS
import {
  FormPartsContainer,
  ColumnHeading
} from './formHelpers';

// COMPONENT HELPER FUNCTIONS
import { getTimeSetter } from '../utils/getTimeSetter';

// OBJECT MANIPULATION
import { cloneDeep } from 'lodash';


// ======================
// GENERICS
// ======================
// To be able to adjust sizes easily
// Very specific to household size. May be worth creating
// a constructor for columns in general, or maybe use a Grid.
const columnStyle = {
  display: 'inline-block',
  textAlign: 'center',
  marginTop: '0.7em',
  // marginBottom: '0.7em'
};

const Columns = {};

// `noMargin` is a bit hacky, but it'll do for now
Columns.One = function ({ noMargin, children }) {
  var marginTop = columnStyle.marginTop;
  if ( noMargin ) { marginTop = 0; }
  return ( <div style={{...columnStyle, marginTop: marginTop, width: '5em'}}> {children} </div> );
}

Columns.Two = function ({ noMargin, children }) {
  var marginTop = columnStyle.marginTop;
  if ( noMargin ) { marginTop = 0; }
  return ( <div style={{...columnStyle, marginTop: marginTop, width: '20em', textAlign: 'left', paddingLeft: '1em'}}> {children} </div> );
}

Columns.Three = function ({ noMargin, children }) {
  var marginTop = columnStyle.marginTop;
  if ( noMargin ) { marginTop = 0; }
  return ( <div style={{...columnStyle, marginTop: marginTop, width: '5em'}}> {children} </div> );
}

Columns.Four = function ({ noMargin, children }) {
  var marginTop = columnStyle.marginTop;
  if ( noMargin ) { marginTop = 0; }
  return ( <div style={{...columnStyle, marginTop: marginTop, width: '10em'}}> {children} </div> );
}


/** @todo description
* 
* @function
* @param {object} props
* @property {object} props.__ - explanation
* 
* @returns Component
*/
const ColumnHeader = function ({ children, columnNum }) {

  var Container = Columns[ columnNum ];

  return (
    <Container>
      <ColumnHeading type={'household'} colName={''}>
        { children }
      </ColumnHeading>
    </Container>
  );

};


/** @todo description
* 
* @function
* @param {object} props
* @property {object} props.__ - explanation
* 
* @returns Component
*/
const MemberButton = function ({ basic, color, iconName, className, onClick }) {

  color = color || null;

  return (
    <Button
      basic={!!basic}
      color={color}
      icon={iconName}
      className={className}
      onClick={onClick}
      style={{ padding: '0', height: '2.2em', width: '2.2em' }}
      circular />
  );

};


// ======================
// UNIQUE
// ======================

/** @todo description
* 
* @function
* @param {object} props
* @property {object} props.__ - explanation
* 
* @returns Component
*/
const Role = function ({ member, setMember }) {

  var ThisRole  = null,
      margin   = '0';

  if ( member.index === 0 ) {

    ThisRole  = <span>Head of Household</span>;

  } else if ( member.index === 1 ) {

    margin = '-1em';

    var options = [
      { text: 'Spouse of Head of Household', value: 'spouse' },
      { text: 'Household Member', value: 'member' }
    ];

    ThisRole = <Dropdown selection
                  name={'m_role'}
                  value={member.m_role}
                  options={options}
                  onChange={setMember}/>

  } else {

    ThisRole  = <span>Household Member</span>;

  }

  // Styles will have to be adjusted.
  return (
    <div style={{ display: 'inline-block', width: '100%', textAlign: 'left', marginLeft: margin }}>
      { ThisRole }
    </div>
  );

};  // End Role(<>)


/** @todo description
* 
* @function
* @param {object} props
* @property {object} props.__ - explanation
* 
* @returns Component
*/
const MemberField = function ({ household, time, setHousehold, setClientProperty }, indx ) {

  var member      = household[ indx ],
      routeStart  = 'household/' + indx + '/';
  member.index    = indx;  // Just needed as member prop in this file


  var onMemberChange = function ( evnt, inputProps ) {
    var route = routeStart + inputProps.name;
    var data  = { route: route, value: inputProps.value };
    setClientProperty( evnt, data );
  };


  var onMemberChecked = function ( evnt, inputProps ) {
    var route = routeStart + inputProps.name;
    var data  = { route: route, value: inputProps.checked };
    setClientProperty( evnt, data );
  };


  var removeMember = function ( evnt, inputProps ) {
    household.splice( indx, 1 );
    setHousehold( evnt, household );
  };  // End removeMember()


  // The font size thing is a bit weird, but... later
  return (
    <Form.Field key={indx}>

      <Columns.One>
        { indx > 0
          ? <MemberButton className={'remove'} onClick={removeMember} iconName={'remove'} />
          : <span>{ household.length > 1
            ? <Icon fitted name={'ban'} style={{ color: '#cfcfd0', fontSize: '2.2em', verticalAlign: 'text-top' }} />
            : null
          }</span>
        }
      </Columns.One>

      <Columns.Two>
        <Role member={member} setMember={onMemberChange} />
      </Columns.Two>

      <Columns.Three>
        <Input
          className = {time + '-member-age ' + time}
          onChange  = {onMemberChange}
          value     = {member.m_age}
          name      = {'m_age'}
          type      = {'number'} step = {'1'} min = {'0'} />
      </Columns.Three>

      <Columns.Four>
        <Checkbox name={'m_disabled'} checked={member.m_disabled} onChange={onMemberChecked} />
      </Columns.Four>

    </Form.Field>
  );

};  // End MemberField()


/** @todo description
* 
* @function
* @param {object} props
* @property {object} props.__ - explanation
* 
* @returns Component
*/
const getMembers = function ( current, time, setHousehold, setClientProperty ) {

  var household = current.household,
      props     = {
        household:          household,
        time:               time,
        setHousehold:       setHousehold,
        setClientProperty:  setClientProperty
      }

  var mems = [];
  for (let memi = 0; memi < household.length; memi++) {
    mems.push( MemberField( props, memi ) );
  };

  return mems;

};  // End getMembers()


/** @todo description
* 
* @todo Could this be a number field? If not, then a dropdown?
* 
* @function
* @param {object} props
* @property {object} props.__ - explanation
* 
* @returns Component
*/
const HouseholdContent = function ({ current, time, setClientProperty }) {

  // Don't mutate state properties
  var household = cloneDeep( current.household );


  var setHousehold = function ( evnt, newHousehold ) {

    var obj = {
      route: 'household',
      value: newHousehold
    };

    setClientProperty( evnt, obj );

  };  // End setHousehold()


  var addMember = function ( evnt, inputProps ) {

    var member = { m_age: 30, m_role: 'member', m_disabled: false };
    if ( household.length === 1 ) {
      member.m_role = 'spouse';
    }

    household.push( member );
    setHousehold( evnt, household );

  };  // End addMember()


  return (
    <wrapper className='field-aligner two-column'>
      <div style={{marginBottom: '.5em'}}>
        <ColumnHeader columnNum='One'></ColumnHeader>
        <ColumnHeader columnNum='Two'>Role</ColumnHeader>
        <ColumnHeader columnNum='Three'>Age</ColumnHeader>
        <ColumnHeader columnNum='Four'>Disabled</ColumnHeader>
      </div>

      { getMembers( current, time, setHousehold, setClientProperty ) }

      <Button id={'addMember'} basic onClick={addMember}>
        <Columns.One noMargin={true}>
          <MemberButton
            basic color={'teal'}
            className={'add'}
            iconName={'plus'} />
        </Columns.One>

        <Columns.Two noMargin={true}>
          <Header as='h4' color={'teal'}> Add a member </Header>
        </Columns.Two>

        <Columns.Three noMargin={true} />
        <Columns.Four noMargin={true} />
      </Button>

    </wrapper>
  );

};  // End HouseholdContent()


/** @todo description
* 
* @function
* @param {object} props
* @property {object} props.__ - explanation
* 
* @returns Component
*/
// `props` is a cloned version of the original props. References broken.
const HouseholdStep = function ( props ) {

  const setTimeProp = getTimeSetter( 'current', props.changeClient );

  return (
    <Form className='current-household-size-form'>
      <FormPartsContainer
        title     = {'Household'}
        clarifier = {'Information about the members of your household.'}
        left      = {{name: 'Previous', func: props.previousStep}}
        right     = {{name: 'Next', func: props.nextStep}}>
			<HouseholdContent setClientProperty={setTimeProp} current={props.client.current} time={'current'} />
      </FormPartsContainer>
    </Form>
  );

};  // End HouseholdStep()

export { HouseholdStep };
