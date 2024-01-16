export default function EmptyPage(props) {
    return (
        <div style={{ display: 'flex', alignItems: 'middle', justifyContent: 'center', padding: '5% 0' }}>
            <center>
                <img src='/images/empty-folder.png' style={{ width: '40%' }} />
                <h3 style={{ margin: 0, fontWeight: 500 }}>{props.title}</h3>
            </center>
        </div>
    )
}