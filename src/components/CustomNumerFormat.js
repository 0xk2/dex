import NumberFormat from 'react-number-format';

function CustomerNumberFormat(props){
  let style = {display: "inline-block"}
  style.backgroundColor = props.highlight === 1 ? "yellow": "transperant";
  return <div style={style}>
    <NumberFormat {...props} />
  </div>
}

export function num(val){
  return <CustomerNumberFormat value={val} displayType={'text'} thousandSeparator={true} decimalScale={5} highlight={1} />
}

export default CustomerNumberFormat;