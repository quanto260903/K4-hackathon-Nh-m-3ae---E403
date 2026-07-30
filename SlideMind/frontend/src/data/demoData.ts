import { SummaryResult, SlideData } from '../types';

export const demoSlides: SlideData[] = [
  {
    slideNumber: 1,
    title: 'Giới thiệu môn học: Nhập môn Trí tuệ Nhân tạo',
    content: 'Trí tuệ nhân tạo (AI) là gì? Mục tiêu môn học. Ứng dụng AI trong cuộc sống. Yêu cầu môn học và đánh giá.',
    rawText: 'Giới thiệu môn học: Nhập môn Trí tuệ Nhân tạo\nTrí tuệ nhân tạo (AI) là gì?\nMục tiêu môn học\nỨng dụng AI trong cuộc sống\nYêu cầu môn học và đánh giá'
  },
  {
    slideNumber: 2,
    title: 'Lịch sử phát triển AI',
    content: 'Thập niên 1950: Alan Turing và Bài kiểm tra Turing. 1956: Hội nghị Dartmouth - khai sinh thuật ngữ AI. Mùa đông AI (1970s, 1980s). Sự bùng nổ Deep Learning từ 2012. Kỷ nguyên AI hiện đại: GPT, DALL-E, AlphaGo.',
    rawText: 'Lịch sử phát triển AI\nThập niên 1950: Alan Turing và Bài kiểm tra Turing\n1956: Hội nghị Dartmouth - khai sinh thuật ngữ AI\nMùa đông AI (1970s, 1980s)\nSự bùng nổ Deep Learning từ 2012'
  },
  {
    slideNumber: 3,
    title: 'Phân loại AI',
    content: 'Narrow AI (AI hẹp): Chuyên biệt một nhiệm vụ - AlphaGo, Siri. General AI (AI tổng quát): Thực hiện mọi nhiệm vụ như con người. Super AI (Siêu AI): Vượt trội mọi năng lực con người - còn trong lý thuyết.',
    rawText: 'Phân loại AI\nNarrow AI (AI hẹp): Chuyên biệt một nhiệm vụ - AlphaGo, Siri\nGeneral AI (AI tổng quát): Thực hiện mọi nhiệm vụ như con người\nSuper AI (Siêu AI): Vượt trội mọi năng lực con người - còn trong lý thuyết'
  },
  {
    slideNumber: 4,
    title: 'Machine Learning cơ bản',
    content: 'Machine Learning là gì? Học có giám sát (Supervised Learning). Học không giám sát (Unsupervised Learning). Học tăng cường (Reinforcement Learning). Các thuật toán phổ biến: Linear Regression, Decision Tree, SVM, K-Means.',
    rawText: 'Machine Learning cơ bản\nMachine Learning là gì?\nHọc có giám sát (Supervised Learning)\nHọc không giám sát (Unsupervised Learning)\nHọc tăng cường (Reinforcement Learning)'
  },
  {
    slideNumber: 5,
    title: 'Deep Learning và Mạng nơ-ron',
    content: 'Mạng nơ-ron nhân tạo (ANN). Kiến trúc Deep Learning: CNN, RNN, LSTM, Transformer. Quá trình huấn luyện: Forward pass, Backpropagation, Gradient Descent. GPU và sức mạnh tính toán. Frameworks: TensorFlow, PyTorch.',
    rawText: 'Deep Learning và Mạng nơ-ron\nMạng nơ-ron nhân tạo (ANN)\nKiến trúc Deep Learning: CNN, RNN, LSTM, Transformer\nQuá trình huấn luyện: Forward pass, Backpropagation, Gradient Descent'
  },
  {
    slideNumber: 6,
    title: 'Xử lý ngôn ngữ tự nhiên (NLP)',
    content: 'NLP là gì và tại sao quan trọng? Tokenization, Embedding, Attention. Mô hình ngôn ngữ lớn (LLM): BERT, GPT. Ứng dụng: Dịch máy, Chatbot, Phân tích cảm xúc, Tóm tắt văn bản.',
    rawText: 'Xử lý ngôn ngữ tự nhiên (NLP)\nNLP là gì và tại sao quan trọng?\nTokenization, Embedding, Attention\nMô hình ngôn ngữ lớn (LLM): BERT, GPT'
  },
  {
    slideNumber: 7,
    title: 'Thị giác máy tính (Computer Vision)',
    content: 'Computer Vision: Máy tính "nhìn" và hiểu hình ảnh. Phát hiện vật thể (Object Detection): YOLO, R-CNN. Phân đoạn ảnh (Image Segmentation). Nhận dạng khuôn mặt. Ứng dụng: Xe tự lái, Y tế, An ninh.',
    rawText: 'Thị giác máy tính (Computer Vision)\nComputer Vision: Máy tính nhìn và hiểu hình ảnh\nPhát hiện vật thể (Object Detection): YOLO, R-CNN\nỨng dụng: Xe tự lái, Y tế, An ninh'
  },
  {
    slideNumber: 8,
    title: 'Đạo đức AI',
    content: 'Thiên kiến trong AI (AI Bias). Sự minh bạch và giải thích được (Explainability). Quyền riêng tư dữ liệu. Tác động đến việc làm. Quy định và luật pháp về AI. Trách nhiệm trong phát triển AI.',
    rawText: 'Đạo đức AI\nThiên kiến trong AI (AI Bias)\nSự minh bạch và giải thích được (Explainability)\nQuyền riêng tư dữ liệu\nTác động đến việc làm'
  },
  {
    slideNumber: 9,
    title: 'Ứng dụng thực tế của AI',
    content: 'Y tế: Chẩn đoán bệnh, Phát hiện ung thư. Giáo dục: Cá nhân hóa học tập, Gia sư AI. Tài chính: Phát hiện gian lận, Giao dịch tự động. Giao thông: Xe tự lái, Tối ưu lộ trình. Sáng tạo: Tạo hình ảnh, Âm nhạc, Văn bản.',
    rawText: 'Ứng dụng thực tế của AI\nY tế: Chẩn đoán bệnh, Phát hiện ung thư\nGiáo dục: Cá nhân hóa học tập, Gia sư AI\nTài chính: Phát hiện gian lận, Giao dịch tự động'
  }
];

export const demoSummary: SummaryResult = {
  lectureTitle: 'Nhập môn Trí tuệ Nhân tạo',
  totalSlides: 9,
  overallSummary: `Bài giảng "Nhập môn Trí tuệ Nhân tạo" cung cấp một cái nhìn toàn diện về lĩnh vực AI từ lịch sử hình thành đến các ứng dụng hiện đại. Bắt đầu từ [Slide 1] với định nghĩa cơ bản về AI và mục tiêu môn học, bài giảng dẫn dắt sinh viên qua hành trình hơn 70 năm phát triển của trí tuệ nhân tạo, từ Bài kiểm tra Turing năm 1950 đến kỷ nguyên Large Language Models ngày nay [Slide 2].

Phần cốt lõi của bài giảng tập trung vào ba trụ cột kỹ thuật chính: Machine Learning với các phương pháp học có giám sát và không giám sát [Slide 4], Deep Learning với kiến trúc mạng nơ-ron sâu như CNN và Transformer [Slide 5], cùng hai lĩnh vực ứng dụng quan trọng là Xử lý ngôn ngữ tự nhiên [Slide 6] và Thị giác máy tính [Slide 7]. Sinh viên sẽ hiểu được sự phân cấp từ AI hẹp đến AI tổng quát và siêu AI [Slide 3].

Bài giảng không chỉ dừng lại ở kỹ thuật mà còn đề cập sâu đến khía cạnh đạo đức trong AI [Slide 8], bao gồm vấn đề thiên kiến, minh bạch, quyền riêng tư và tác động xã hội. Phần kết [Slide 9] mang đến cái nhìn thực tế về cách AI đang thay đổi các ngành y tế, giáo dục, tài chính và giao thông.

Tổng thể, bài giảng xây dựng nền tảng vững chắc cho sinh viên muốn khám phá lĩnh vực AI, cân bằng giữa lý thuyết nền tảng và ứng dụng thực tiễn, đồng thời nuôi dưỡng tư duy phê phán và có trách nhiệm khi làm việc với công nghệ AI.`,
  mainTopics: [
    {
      title: 'Nền tảng và Lịch sử AI',
      summary: 'AI được định nghĩa là khả năng máy tính mô phỏng trí thông minh của con người. Từ Bài kiểm tra Turing năm 1950 [Slide 2], qua các giai đoạn thăng trầm với "Mùa đông AI", đến sự bùng nổ mạnh mẽ từ 2012 khi Deep Learning chiếm ưu thế. AI được phân loại thành ba mức: Narrow AI đang tồn tại, General AI đang nghiên cứu, và Super AI còn trong lý thuyết [Slide 3].',
      sourceSlides: [1, 2, 3]
    },
    {
      title: 'Machine Learning và Deep Learning',
      summary: 'Machine Learning cho phép máy tính học từ dữ liệu mà không cần lập trình cứng. Ba dạng học chính là có giám sát, không giám sát và tăng cường [Slide 4]. Deep Learning sử dụng mạng nơ-ron nhiều lớp với kiến trúc như CNN và Transformer. Quá trình huấn luyện dựa trên Backpropagation và Gradient Descent [Slide 5].',
      sourceSlides: [4, 5]
    },
    {
      title: 'NLP và Computer Vision',
      summary: 'Xử lý ngôn ngữ tự nhiên (NLP) giúp máy tính hiểu và tạo ra ngôn ngữ con người. Các mô hình như BERT và GPT đã tạo ra bước đột phá trong dịch máy, chatbot và tóm tắt văn bản [Slide 6]. Computer Vision cho phép máy tính phân tích hình ảnh với các ứng dụng như YOLO cho phát hiện vật thể, nhận dạng khuôn mặt và hỗ trợ xe tự lái [Slide 7].',
      sourceSlides: [6, 7]
    },
    {
      title: 'Đạo đức AI và Ứng dụng Thực tế',
      summary: 'Phát triển AI phải đi kèm với trách nhiệm xã hội: tránh thiên kiến, đảm bảo tính minh bạch, bảo vệ quyền riêng tư và tuân thủ quy định pháp luật [Slide 8]. AI đang cách mạng hóa y tế (chẩn đoán bệnh), giáo dục (cá nhân hóa), tài chính (phát hiện gian lận) và giao thông (xe tự lái) [Slide 9].',
      sourceSlides: [8, 9]
    }
  ],
  slideSummaries: [
    {
      slideNumber: 1,
      title: 'Giới thiệu môn học',
      summary: 'Slide giới thiệu tổng quan môn học Nhập môn Trí tuệ Nhân tạo, định nghĩa AI là khả năng máy tính thực hiện các nhiệm vụ đòi hỏi trí thông minh của con người.',
      keyPoints: [
        'AI (Trí tuệ nhân tạo) là lĩnh vực khoa học máy tính mô phỏng trí thông minh người',
        'Môn học cung cấp nền tảng lý thuyết và thực hành về AI',
        'Yêu cầu: tư duy logic, lập trình cơ bản, toán học xác suất thống kê'
      ]
    },
    {
      slideNumber: 2,
      title: 'Lịch sử phát triển AI',
      summary: 'Lịch sử AI bắt đầu từ 1950 với Alan Turing, trải qua nhiều thăng trầm trước khi bùng nổ mạnh mẽ với Deep Learning từ năm 2012.',
      keyPoints: [
        'Alan Turing đề xuất "Bài kiểm tra Turing" năm 1950 để đánh giá trí thông minh máy',
        'Hai giai đoạn "Mùa đông AI" (1970s, 1980s) do kỳ vọng quá cao và công nghệ chưa đủ',
        'Từ 2012, Deep Learning tạo bước đột phá với ImageNet, dẫn đến GPT, DALL-E ngày nay'
      ]
    },
    {
      slideNumber: 3,
      title: 'Phân loại AI',
      summary: 'AI được phân thành ba cấp độ theo khả năng tổng quát: Narrow AI (đang có), General AI (đang nghiên cứu) và Super AI (lý thuyết).',
      keyPoints: [
        'Narrow AI: chuyên biệt một nhiệm vụ cụ thể - ví dụ AlphaGo chỉ chơi cờ vây',
        'General AI: thực hiện mọi nhiệm vụ trí tuệ như con người - chưa đạt được',
        'Super AI: vượt trội con người ở mọi lĩnh vực - còn trong lý thuyết và gây tranh luận đạo đức'
      ]
    },
    {
      slideNumber: 4,
      title: 'Machine Learning cơ bản',
      summary: 'Machine Learning cho phép máy tính học từ kinh nghiệm và dữ liệu thay vì được lập trình từng bước. Ba phương pháp học chính tương ứng với ba dạng vấn đề khác nhau.',
      keyPoints: [
        'Học có giám sát: học từ dữ liệu có nhãn, dự đoán kết quả mới (phân loại, hồi quy)',
        'Học không giám sát: tìm cấu trúc ẩn trong dữ liệu không nhãn (phân cụm, giảm chiều)',
        'Học tăng cường: tác nhân học qua thử-sai và phần thưởng trong môi trường tương tác'
      ]
    },
    {
      slideNumber: 5,
      title: 'Deep Learning và Mạng nơ-ron',
      summary: 'Deep Learning sử dụng mạng nơ-ron nhiều lớp để học đặc trưng phức tạp từ dữ liệu thô, tạo ra bước đột phá trong nhận dạng ảnh, giọng nói và ngôn ngữ.',
      keyPoints: [
        'Mạng nơ-ron mô phỏng cơ chế hoạt động của não người với các lớp neuron kết nối',
        'CNN tối ưu cho xử lý ảnh; RNN/LSTM cho dữ liệu tuần tự; Transformer cho NLP',
        'Backpropagation tính gradient ngược để cập nhật trọng số, giúp mạng học từ lỗi'
      ]
    },
    {
      slideNumber: 6,
      title: 'Xử lý ngôn ngữ tự nhiên (NLP)',
      summary: 'NLP là nhánh AI cho phép máy tính hiểu, phân tích và tạo ra ngôn ngữ tự nhiên. Sự xuất hiện của Transformer và LLM đã cách mạng hóa lĩnh vực này.',
      keyPoints: [
        'Tokenization chuyển văn bản thành tokens; Embedding ánh xạ token thành vector số',
        'Cơ chế Attention trong Transformer cho phép mô hình tập trung vào phần quan trọng',
        'LLM như GPT-4 có thể viết văn, dịch thuật, lập trình và phân tích cảm xúc'
      ]
    },
    {
      slideNumber: 7,
      title: 'Thị giác máy tính (Computer Vision)',
      summary: 'Computer Vision giúp máy tính "nhìn" và hiểu nội dung hình ảnh/video, được ứng dụng rộng rãi từ y tế đến xe tự lái.',
      keyPoints: [
        'CNN trích xuất đặc trưng không gian từ ảnh qua các bộ lọc convolution',
        'YOLO (You Only Look Once) phát hiện và phân loại nhiều vật thể trong ảnh theo thời gian thực',
        'Xe tự lái sử dụng kết hợp Computer Vision, LiDAR và Deep Learning để điều hướng an toàn'
      ]
    },
    {
      slideNumber: 8,
      title: 'Đạo đức AI',
      summary: 'Phát triển AI cần tuân theo các nguyên tắc đạo đức để đảm bảo công bằng, minh bạch và không gây hại cho xã hội.',
      keyPoints: [
        'AI Bias: dữ liệu huấn luyện thiên lệch dẫn đến quyết định không công bằng',
        'Explainability (XAI): yêu cầu AI giải thích được lý do quyết định, đặc biệt trong y tế và tư pháp',
        'EU AI Act và các quy định pháp lý đang định hình trách nhiệm phát triển AI'
      ]
    },
    {
      slideNumber: 9,
      title: 'Ứng dụng thực tế của AI',
      summary: 'AI đang biến đổi sâu sắc nhiều ngành công nghiệp, từ chẩn đoán y tế đến sáng tạo nghệ thuật, mang lại cả cơ hội và thách thức cho xã hội.',
      keyPoints: [
        'Y tế: AI phát hiện ung thư từ hình ảnh y tế với độ chính xác ngang hoặc vượt bác sĩ',
        'Giáo dục: hệ thống học thích ứng cá nhân hóa nội dung và tốc độ học cho từng sinh viên',
        'Tài chính và giao thông: phát hiện gian lận thời gian thực và xe tự lái cấp độ 4-5'
      ]
    }
  ],
  keyTerms: [
    {
      term: 'Trí tuệ nhân tạo (AI)',
      definition: 'Lĩnh vực khoa học máy tính nghiên cứu và phát triển các hệ thống có khả năng thực hiện các nhiệm vụ đòi hỏi trí thông minh của con người.',
      sourceSlides: [1, 2]
    },
    {
      term: 'Machine Learning (Học máy)',
      definition: 'Nhánh của AI cho phép máy tính học từ dữ liệu và cải thiện hiệu suất theo thời gian mà không cần được lập trình tường minh.',
      sourceSlides: [4]
    },
    {
      term: 'Deep Learning (Học sâu)',
      definition: 'Kỹ thuật Machine Learning sử dụng mạng nơ-ron nhân tạo nhiều lớp để học đặc trưng phân cấp từ dữ liệu.',
      sourceSlides: [5]
    },
    {
      term: 'Mạng nơ-ron (Neural Network)',
      definition: 'Mô hình tính toán lấy cảm hứng từ não người, bao gồm các nút (neuron) kết nối với nhau theo lớp.',
      sourceSlides: [5]
    },
    {
      term: 'NLP (Xử lý ngôn ngữ tự nhiên)',
      definition: 'Nhánh AI giúp máy tính hiểu, diễn giải và tạo ra ngôn ngữ của con người. Ứng dụng: dịch máy, chatbot, phân tích cảm xúc.',
      sourceSlides: [6]
    },
    {
      term: 'Transformer',
      definition: 'Kiến trúc mạng nơ-ron sử dụng cơ chế Self-Attention để xử lý chuỗi dữ liệu song song, là nền tảng của các mô hình ngôn ngữ lớn như GPT và BERT.',
      sourceSlides: [5, 6]
    },
    {
      term: 'Computer Vision (Thị giác máy tính)',
      definition: 'Lĩnh vực AI giúp máy tính phân tích và hiểu nội dung của hình ảnh và video, bao gồm phát hiện vật thể và nhận dạng khuôn mặt.',
      sourceSlides: [7]
    },
    {
      term: 'Backpropagation',
      definition: 'Thuật toán huấn luyện mạng nơ-ron bằng cách tính toán gradient của hàm mất mát theo chiều ngược, cập nhật trọng số để giảm thiểu sai số.',
      sourceSlides: [5]
    },
    {
      term: 'AI Bias (Thiên kiến AI)',
      definition: 'Hiện tượng hệ thống AI đưa ra kết quả không công bằng do dữ liệu huấn luyện hoặc thiết kế thuật toán có thiên kiến.',
      sourceSlides: [8]
    },
    {
      term: 'LLM (Mô hình ngôn ngữ lớn)',
      definition: 'Mô hình AI được huấn luyện trên lượng dữ liệu văn bản khổng lồ, có khả năng hiểu và tạo ra văn bản tự nhiên ở mức độ cao. Ví dụ: GPT-4, Claude, Gemini.',
      sourceSlides: [6]
    }
  ],
  reviewQuestions: [
    'Bài kiểm tra Turing là gì và tại sao nó quan trọng trong lịch sử phát triển AI? Mô tả các tiêu chí của bài kiểm tra này. [Slide 2]',
    'So sánh sự khác biệt giữa Narrow AI, General AI và Super AI. Cho ví dụ cụ thể về các hệ thống AI thuộc loại Narrow AI hiện nay. [Slide 3]',
    'Giải thích ba loại Machine Learning (có giám sát, không giám sát, tăng cường). Mỗi loại phù hợp với bài toán nào? [Slide 4]',
    'Tại sao kiến trúc Transformer lại tạo ra bước ngoặt trong NLP? Cơ chế Attention hoạt động như thế nào? [Slide 5, 6]',
    'Nêu ít nhất ba vấn đề đạo đức trong AI và cách ngành công nghiệp đang giải quyết chúng. Bạn nghĩ vấn đề nào nghiêm trọng nhất và tại sao? [Slide 8]'
  ],
  isDemo: true,
  processingTime: 1200
};
