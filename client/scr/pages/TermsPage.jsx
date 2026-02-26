import React from "react";

const TermsPage = () => {
  return (
    <div className="min-h-[60vh] py-8">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-3xl font-bold mb-4">Điều khoản dịch vụ</h1>
        <p className="text-[#555] mb-4">
          Dưới đây là điều khoản dịch vụ mẫu. Nội dung này là cố định và chỉ
          dùng cho mục đích demo.
        </p>

        <section className="mb-4">
          <h2 className="font-semibold">1. Sử dụng nội dung</h2>
          <p className="text-[#666]">
            Người dùng không được sao chép, phân phối hoặc tái xuất bản nội dung
            mà không có sự cho phép.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="font-semibold">2. Trách nhiệm</h2>
          <p className="text-[#666]">
            Chúng tôi không chịu trách nhiệm cho các sai sót trong dữ liệu thử
            nghiệm.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">3. Liên hệ</h2>
          <p className="text-[#666]">
            Mọi câu hỏi về điều khoản vui lòng gửi email tới
            contact@bookonline.example.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
