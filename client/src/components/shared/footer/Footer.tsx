const Footer = () => {
  return (
    <footer className="footer footer-center bg-base-100 text-base-content p-4 border-t dark:border-purple-600 dark:bg-black">
      <aside>
        <p>
          Copyright &copy; {new Date().getFullYear()} - All right reserved by{" "}
          <span className="font-mono font-bold text-purple-700">
            Md Jaoadul Islam
          </span>
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
