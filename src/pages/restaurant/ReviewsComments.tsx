import { useState } from "react";

interface Review {
  id: number;
  username: string;
  comment: string;
  replies: string[];
  rating: number;
}

export function ReviewsComments() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      username: "foodie123",
      comment: "Great food and excellent service!",
      replies: ["Thank you for your feedback!", "We hope to see you again soon."],
      rating: 5,
    },
    {
      id: 2,
      username: "dininglover",
      comment: "The ambiance was nice, but the food was average.",
      replies: [],
      rating: 3,
    },
  ]);

  const [replyText, setReplyText] = useState("");
  const [replyBox, setReplyBox] = useState<number | null>(null);

  const handleReplySubmit = (reviewId: number) => {
    if (!replyText.trim()) return;

    const updatedReviews = reviews.map((review) =>
      review.id === reviewId ? { ...review, replies: [...review.replies, replyText] } : review
    );

    setReviews(updatedReviews);
    setReplyText("");
    setReplyBox(null);
  };

  const handleReport = (comment: string) => {
    alert(`Reported harmful comment: "${comment}"`);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <h1 className="text-5xl font-bold text-center mb-10">Reviews and Comments</h1>
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-xl shadow p-5 border">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-lg">{review.username}</h3>
          </div>

          <p className="text-gray-800 mb-4">{review.comment}</p>

          {/* Buttons */}
          <div className="flex gap-126 mb-4">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setReplyBox(replyBox === review.id ? null : review.id)}>
              Reply
            </button>

            <button
              className="text-red-600 hover:underline"
              onClick={() => handleReport(review.comment)}>
              Report Harmful Comment
            </button>
          </div>

          {/* Reply Box */}
          {replyBox === review.id && (
            <div className="mb-4">
              <textarea
                className="w-full border rounded p-2"
                rows={3}
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}></textarea>
              <button
                className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                onClick={() => handleReplySubmit(review.id)}>
                Submit Reply
              </button>
            </div>
          )}

          {/* Replies */}
          {review.replies.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold mb-2">Replies:</h4>
              {review.replies.map((reply, index) => (
                <p key={index} className="bg-gray-100 p-2 rounded mb-2 text-gray-700">
                  {reply}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* FOOTER ACTIONS */}
      <div className="text-center mt-20 mb-12">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="border px-6 py-2 rounded hover:bg-gray-100 mb-4">
          Top
        </button>

        <div className="mt-4">
          <a href="/restaurant-dashboard" className="text-[#920728] underline">
            Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
