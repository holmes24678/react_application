import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import './KanbanBoard.css';

const apiUrl = 'https://api.quicksell.co/v1/internal/frontend-assignment';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayState, setDisplayState] = useState({
    grouping: 'user',
    ordering: 'priority',
  });
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setTickets(data.tickets);
        setUsers(data.users);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const groupTickets = (tickets, grouping) => {
    if (grouping === 'user') {
      return tickets.reduce((acc, ticket) => {
        const userName = getUserName(ticket.userId);
        if (!acc[userName]) acc[userName] = [];
        acc[userName].push(ticket);
        return acc;
      }, {});
    }

    if (grouping === 'status') {
      return tickets.reduce((acc, ticket) => {
        const status = ticket.status;
        if (!acc[status]) acc[status] = [];
        acc[status].push(ticket);
        return acc;
      }, {});
    }

    return {};
  };

  const sortTicketsByPriority = (tickets) => {
    return tickets.sort((a, b) => a.priority - b.priority);
  };

  const groupedAndOrderedTickets = () => {
    const grouped = groupTickets(tickets, displayState.grouping);
    Object.keys(grouped).forEach((key) => {
      grouped[key] = sortTicketsByPriority(grouped[key]);
    });
    return grouped;
  };

  const groupedTickets = groupedAndOrderedTickets();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="kanban-board">
      {/* Header */}
      <header className="kanban-header">
        {/* Display State Dropdown */}
        <select
          value="Display State"
          onClick={() => setDropdownVisible((prev) => !prev)}
          className="dropdown-item"
        >
          <option value="displayState">Display State</option>
        </select>

        {isDropdownVisible && (
          <div ref={dropdownRef} className="dropdown-box">
            {/* Grouping Dropdown */}
            <div className="dropdown-item">
            <label>Grouping</label>
              <select
                value={displayState.grouping}
                onChange={(e) =>
                  setDisplayState({ ...displayState, grouping: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="status">Status</option>
              </select>
            </div>
            {/* Ordering Dropdown */}
            <div className="dropdown-item">
            <label>Ordering</label>
              <select
                value={displayState.ordering}
                onChange={(e) =>
                  setDisplayState({ ...displayState, ordering: e.target.value })
                }
              >
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
        )}
      </header>

      {/* Kanban Columns */}
      <div className="kanban-columns">
        {Object.keys(groupedTickets).map((group) => (
          <div key={group} className="kanban-column">
            <h3>{group}</h3>
            <div className="kanban-cards">
              {groupedTickets[group].map((task) => (
                <Card
                  key={task.id}
                  task={task}
                  ticketId={task.id}
                  onClick={() => alert(`Clicked on: ${task.title}`)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
