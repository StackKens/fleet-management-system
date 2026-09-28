const issueService = require('../services/issue.service');

async function getAll(req, res, next) {
  try {
    const issues = await issueService.getAllIssues(req.query);
    res.json({ success: true, data: issues });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const issue = await issueService.getIssueById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    res.json({ success: true, data: issue });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const issue = await issueService.createIssue(req.body);
    res.status(201).json({ success: true, message: 'Issue created', data: issue });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const issue = await issueService.updateIssue(req.params.id, req.body);
    res.json({ success: true, message: 'Issue updated', data: issue });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await issueService.deleteIssue(req.params.id);
    res.json({ success: true, message: 'Issue deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove };
