import { useEffect, useRef, useState } from 'react';
import Client from '../../components/Client';
import './EditorPage.css';
import Editor from '../../components/Editor';
import { initSocket } from '../../utils/socket';
import { ACTIONS } from '../../utils/constant';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditorPage() {
  const [clients, setClients] = useState([]);
  const [editable, setEditable] = useState(true);
  const [iscreater, setIscreater] = useState(false);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const userName = location.state?.userName || `Guest`;

  const handleErrors = (err) => {
    toast.error('Connection failed, please try again');
    navigate('/');
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success('Room Id copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy Room Id');
    }
  };

  const leaveRoom = () => {
    navigate('/');
  };

  const toggleEditable = () => {
    const newEditableState = !editable;
    socketRef.current.emit(ACTIONS.TOGGLE_EDITABLE, {
      roomId: id,
      editable: newEditableState,
      userName,
    });
    setEditable(newEditableState);
    toast.success(`Editor is now ${newEditableState ? 'editable' : 'read-only'}`);
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on('connect_error', handleErrors);
      socketRef.current.on('connect_failed', handleErrors);

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId: id,
        userName,
        editable,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId, editable, isCreater }) => {
          setClients(clients);
          setEditable(editable);
          // Store the isCreater value in localStorage
          const isLSCreater = sessionStorage.getItem('isCreater');
          if (isLSCreater === null) {
            sessionStorage.setItem('isCreater', isCreater);
            setIscreater(isCreater);
          } else {
            setIscreater(JSON.parse(isLSCreater));
          }

          console.log('isCreater', isCreater);
          if (username !== userName) {
            toast.success(`${username} joined the room`);
          }
          if (codeRef.current) {
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current,
              socketId,
            });
          }
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => prev.filter((client) => client.socketId !== socketId));
      });

      socketRef.current.on(ACTIONS.SET_EDITABLE, ({ editable, username }) => {
        setEditable(editable);
        if (username !== userName) {
          toast.success(`Editor is now ${editable ? 'editable' : 'read-only'}`);
        }
      });
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.off(ACTIONS.SET_EDITABLE);
        socketRef.current.disconnect();
      }
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const copyCode = async () => {
    try {
      if (!codeRef.current) return toast.error('No code to copy');
      await navigator.clipboard.writeText(codeRef.current);
      toast.success('Code copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy code , please try again');
    }
  };

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img src="/mainlogo.png" alt="logoImage" className="logoimage" />
          </div>
          <h3>Connected</h3>
          <div className="clientslist">
            {clients?.map(({ socketId, username }) => (
              <Client username={username} key={socketId} />
            ))}
          </div>
        </div>
        <button
          className={`${!iscreater ? 'disablecreater' : ''} btn togglebtn copybtn`}
          onClick={toggleEditable}
          disabled={!iscreater}
        >
          {editable ? 'Set to Read-Only' : 'Set to Editable'}
        </button>

        <button className="btn copybtn" onClick={copyCode}>
          Copy code
        </button>

        <button className="btn copybtn" onClick={copyRoomId}>
          Copy Room Id
        </button>
        <button className="btn leavebtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={id}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
          copyCode={copyCode}
          editable={editable}
        />
      </div>
    </div>
  );
}

export default EditorPage;
