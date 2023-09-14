import "../helpCompsCss/msgTable.css"
function MsgTable({msgs}){
    return(
        <>
        <table>
            <tr>
                <th>message</th>
                <th>date</th>
            </tr>
            {msgs.map((msg)=> 
                <tr>
                    <td>{msg["message"]}</td>
                    <td>{msg["date"]}</td>
                </tr>
            )}
        </table>
        </>
    );
}
export default MsgTable;