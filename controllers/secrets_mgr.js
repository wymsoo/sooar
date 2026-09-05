//const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

/**
 * Get metadata about a secret.
 *
 * @param {string} projectId The ID of the Google Cloud project.
 * @param {string} secretId The ID of the secret to retrieve.
 */
exports.getSecret = async (projectId, secretId) => {
  const client = new SecretManagerServiceClient();
  const name = `projects/${projectId}/secrets/${secretId}`;
  try {
    const [secret] = await client.getSecret({
      name: name,
    });

    if (secret.replication && secret.replication.replication) {
      const policy = secret.replication.replication;
      console.info(
        `Found secret ${secret.name} with replication policy ${policy}`
      );
    } else {
      console.info(`Found secret ${secret.name} with no replication policy.`);
    }
    return secret;
  } catch (err) {
    console.error(`Failed to retrieve secret ${name}:`, err);
  } finally {
    await client.close();
  }
}

