import React from 'react';
import TeamInfo, { teamData } from '@/components/TeamInfo';

const ContactPage = () => {
  return (
    <div className="min-h-[60vh] py-8">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-3xl font-bold mb-4">Liên hệ</h1>
        <p className="text-[#555] mb-6">Bạn có thể liên hệ với chúng tôi qua email hoặc các thành viên trong nhóm dưới đây.</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Email chung</h2>
          <a className="text-[#007bff]" href="mailto:contact@bookonline.example">contact@bookonline.example</a>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Danh sách liên hệ thành viên</h2>
          <ul className="list-disc pl-6 text-[#555]">
            {teamData.map(member => (
              <li key={member.id} className="mb-2">
                <strong>{member.name}</strong> ({member.role})
                <div className="text-sm">
                  Email: <a className="text-[#007bff]" href={`mailto:${member.email}`}>{member.email}</a>
                </div>
                <div className="text-sm">Số điện thoại: <span className="text-[#007bff]">{member.phone}</span></div>
              </li>
            ))}
          </ul>
        </div>

        <TeamInfo showEmails={true} showPhones={true} />
      </div>
    </div>
  );
};

export default ContactPage;
