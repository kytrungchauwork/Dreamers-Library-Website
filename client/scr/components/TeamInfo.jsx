import React from 'react';

export const teamData = [
  { id: 23127079, name: 'Châu Trung Kỳ', role: 'Manager', email: 'ctky23@clc.fitus.edu.vn'},
  { id: 23127121, name: 'Bùi Hữu Thịnh', role: 'Frontend Developer', email: 'bhthinh23@clc.fitus.edu.vn'},
  { id: 23127022, name: 'Nguyễn Đức Anh', role: 'Frontend Developer', email: 'ndanh23@clc.fitus.edu.vn'},
  { id: 23127101, name: 'Từ Thế Phong', role: 'Backend Developer', email: 'ttphong23@clc.fitus.edu.vn'},
  { id: 23127001, name: 'Nguyễn Lê Quan Anh', role: 'Backend Developer', email: 'nlqanh23@clc.fitus.edu.vn'}
];

const TeamInfo = ({ showEmails = true, showPhones = false }) => {
  return (
    <section className="max-w-[900px] mx-auto my-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Đội ngũ phát triển</h2>
      <p className="text-[#555] mb-6">Dưới đây là thông tin nhóm của chúng tôi.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {teamData.map(member => (
          <div key={member.id} className="p-4 border rounded">
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-sm text-[#777]">{member.role}</p>
            {showEmails && (
              <a className="text-sm text-[#007bff]" href={`mailto:${member.email}`}>{member.email}</a>
            )}
            {showPhones && member.phone && (
              <div className="text-sm text-[#007bff] mt-1">{member.phone}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamInfo;
