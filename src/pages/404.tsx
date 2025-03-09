import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link href="/">Go back to Home</Link>
    </div>
  );
};

export default NotFoundPage;
