import Avatar from 'react-avatar';
import randomColor from 'randomcolor';

function Client({ username }) {
  return (
    <>
      <div className="client">
        <Avatar name={username} size={50} round="14px" color={randomColor()} fgColor="#000" />
        <span className="username">{username.split(' ')[0].slice(0, 6)}</span>
      </div>
    </>
  );
}

export default Client;
