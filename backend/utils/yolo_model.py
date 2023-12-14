# model.py
from ultralytics import YOLO
import numpy as np
import cv2
import torch

# Initialize YOLO model
class PoseModel:
    def __init__(self, model_path):
        self.model = YOLO(model_path)

    def predict(self, frame):
        with torch.no_grad():
            results = self.model.predict(frame, save=False, imgsz=640, conf=0.5, device='cuda', verbose=False)[0]
        return results.keypoints.xy[0].cpu().numpy()
    # keypoints = pose_model.predict(frame)

# Visualization utilities
class PoseVisualizer:
    def __init__(self):
        self.pose_palette = np.array([[255, 128, 0], [255, 153, 51], [255, 178, 102], [230, 230, 0], [255, 153, 255],
                                      [153, 204, 255], [255, 102, 255], [255, 51, 255], [102, 178, 255], [51, 153, 255],
                                      [255, 153, 153], [255, 102, 102], [255, 51, 51], [153, 255, 153], [102, 255, 102],
                                      [51, 255, 51], [0, 255, 0], [0, 0, 255], [255, 0, 0], [255, 255, 255]], dtype=np.uint8)
        self.skeleton = [[22, 15], [15, 13], [13, 11], [23, 16], [16, 14], [14, 12],
                         [21, 11], [21, 12], [21, 20], [20, 17],
                         [17, 5], [17, 6], [5, 7], [6, 8], [7, 9], [8, 10], [9, 18], [10, 19]]
        self.limb_color = self.pose_palette[[9, 9, 9, 9, 9, 9, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0]]
        self.kpt_color = self.pose_palette[[16, 16, 16, 16, 16, 0, 0, 0, 0, 0, 0, 9, 9, 9, 9, 9, 9, 7, 0, 0, 7, 7, 9, 9]]

    def visualize_keypoints(self, frame, keypoints):
        for i, keypoint in enumerate(keypoints):
            if i < 5:  # Skip visualization for eyes, nose, ears
                continue
            x, y = int(keypoint[0]), int(keypoint[1])
            cv2.circle(frame, (x, y), 2, self.kpt_color[i].tolist(), 2)

        for j, (s, t) in enumerate(self.skeleton):
            try:
                x1, y1 = int(keypoints[s][0]), int(keypoints[s][1])
                x2, y2 = int(keypoints[t][0]), int(keypoints[t][1])
                cv2.line(frame, (x1, y1), (x2, y2), self.limb_color[j].tolist(), 2)
            except IndexError:
                continue
        return frame
