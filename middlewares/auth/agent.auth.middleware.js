const requireAgent = (req, res, next) => {
    if (!req.user || req.user.role !== "ticket_agent") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Ticket agent only.",
      });
    }
  
    next();
  };
  
  module.exports = { requireAgent };
  