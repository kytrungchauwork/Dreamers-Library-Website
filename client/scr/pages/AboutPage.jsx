import React, { useEffect, useState } from "react";
import TeamInfo from "@/components/TeamInfo";

const JourneyScript = () => {
  const steps = [
    "Lập kế hoạch và chia task",
    "Thiết kế giao diện và UX",
    "Phát triển frontend",
    "Phát triển backend",
    "Kiểm thử, sửa lỗi và hoàn thiện",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % steps.length);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded">
      <h3 className="font-semibold mb-2">Hành trình thực hiện (tóm tắt)</h3>
      <p className="text-[#555]">{steps[index]}</p>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="min-h-[60vh] py-8">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-3xl font-bold mb-4">Về chúng tôi</h1>
        <p className="text-[#555] mb-6">
          Dreamer's Library là nền tảng đọc truyện trực tuyến. Dự án này được
          xây dựng nhằm mục đích học tập và demo.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Quá trình thực hiện dự án
          </h2>
          <p className="text-[#555]">
            Chúng tôi thực hiện dự án theo các bước chính: lập kế hoạch (xác
            định yêu cầu, phân công nhiệm vụ), thiết kế giao diện, phát triển
            frontend và backend song song, viết unit/integration tests cơ bản,
            và cuối cùng thử nghiệm + triển khai demo. Trong suốt quá trình,
            nhóm trao đổi thường xuyên, review code và phối hợp chặt chẽ để đảm
            bảo tiến độ và chất lượng.
          </p>
        </section>

        <JourneyScript />

        <TeamInfo showEmails={false} />
      </div>
    </div>
  );
};

export default AboutPage;
