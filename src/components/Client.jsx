import Avatar from 'react-avatar';
import randomColor from 'randomcolor';

function Client({ username }) {
  console.log(username);
  return (
    <>
      <div className="client">
        <Avatar name={username} size={50} round="14px" color={randomColor()} fgColor="#000" />
        <span className="username">{username}</span>
      </div>
    </>
  );
}

export default Client;
